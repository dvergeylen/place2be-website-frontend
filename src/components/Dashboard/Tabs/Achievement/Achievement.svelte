<script>
  import { getContext, createEventDispatcher, onDestroy } from 'svelte';
  import { fade } from 'svelte/transition';
  import { createUrl } from '../../../../javascripts/utils/helpers';
  import { fetchData, postFormData } from '../../../../javascripts/utils/helpers';
  import Relation from '../SharedComps/Relation/Relation.svelte';
  import AssetsIndex from '../SharedComps/Assets/AssetsIndex.svelte';
  import AssetsForm from '../SharedComps/Assets/AssetsForm.svelte';
  import { game } from '../../../../javascripts/stores/gameStore';
  import { savingStatus } from '../../../../javascripts/stores/savingStore';

  export let achievement = {
    attributes: {
      assets: [
        {
          key: '',
          tuples: [
            {
              namespaces: $game.data.attributes.namespaces,
              value: '',
            },
          ],
        },
      ],
    },
  };
  let relation;
  let isExpandedSection = {
    conditions: false,
    rewards: false,
    assets: false,
  }
  let displayEditForm = false;
  let displaySavedStatus = false;
  let displaySavedStatusTimeout;
  let error = null;

  const dispatch = createEventDispatcher();
  const apiProtocol = getContext('apiProtocol');
  const apiHost = getContext('apiHost');
  const userId = getContext('userId');

  function updateRelation(event) {
    relation = event.detail.relation;
  }

  async function saveAchievement() {
    savingStatus.set('saving');
    let path, method;

    if (achievement.id) {
      path = ['users', userId, 'games', $game.data.id, 'achievements', achievement.id];
      method = 'PUT';
    } else {
      path = ['users', userId, 'games', $game.data.id, 'achievements'];
      method = 'POST';
    }
    const url = createUrl(apiProtocol, apiHost, ...path);
    const formData = new FormData(document.getElementById(`${achievement.id || 'new'}-achievement-form`));
    const res = await postFormData(url, formData, method);

    if (!res.ok) {
      const t = await res.text();
      error = JSON.parse(t);
      savingStatus.set('failed');
    } else {
      savingStatus.set('saved');
      resetFormDisplay();
      displaySavedBanner();

      /* Dispatch new/updated achievement to Collection's list */
      const updatedAchievement = await res.json();
      dispatch('updateCollection', {
        achievement: updatedAchievement.data,
        included: updatedAchievement.included,
        deprecatedIncludedIds:
          updatedAchievement.included.map((o) => `${o.type}#${o.id}`)
            .concat([`achievement#${updatedAchievement.data.id}`]),
      });
    }
  }

  async function destroyAchievement() {
    savingStatus.set('saving');
    const path = ['users', userId, 'games', $game.data.id, 'achievements', achievement.id];
    const url = createUrl(apiProtocol, apiHost, ...path);
    const res = await postFormData(url, {}, 'DELETE');

    if (res.status !== 204) {
      const t = await res.text();
      error = JSON.parse(t);
      savingStatus.set('failed');
    } else {
      savingStatus.set('saved');
      error = null;

      /* Update actions list */
      dispatch('removeCollectionMember', {
        achievement: {
          id: achievement.id,
        },
      });
    }
  }

  async function resetAchievement() {
    let path, method;
    path = ['users', userId, 'games', $game.data.id, 'achievements', achievement.id];

    const url = createUrl(apiProtocol, apiHost, ...path);
    const res = await fetchData(url);

    if (res.ok) {
      const updatedAchievement = await res.json();
      dispatch('updateCollection', {
        achievement: updatedAchievement.data,
        included: [],
        deprecatedIncludedIds: [`achievement#${updatedAchievement.data.id}`],
      });
    }
    resetFormDisplay();
  }

  function resetFormDisplay() {
    displayEditForm = false;
  }

  function toggleFormDisplay() {
    displayEditForm = !displayEditForm;
  }

  function toggleSection(key, value) {
    isExpandedSection[key] = value;
  }

  function displaySavedBanner() {
    displaySavedStatus = true;
    displaySavedStatusTimeout = setTimeout(() => {
      displaySavedStatus = false;
    }, 1000);
  }

  function flushError() {
    error = null;
  }

  onDestroy(() => {
    clearTimeout(displaySavedStatusTimeout);
  });

  // TODO: replace with conditional chaining support:
  // https://github.com/sveltejs/svelte/commit/2450dd1ff08491739f124bcdf5131a2e7af52bcb
  // not released on svelte at this time of writing.
  $: relation = achievement.relationships &&
             achievement.relationships.relation.data &&
             $game.included.find((e) => (
    e.id === achievement.relationships.relation.data.id &&
    e.type === achievement.relationships.relation.data.type
  ));
</script>



<div class='item-box'>
  {#if !displayEditForm && achievement.id}
    <div class="columns is-mobile">
      <div class="column">
        <h1 class="title is-4 has-vcentered-text item-name">
          <svg class="twemoji">
            <use href="../images/twemoji-sprite.svg#trophy" />
          </svg>
          <span class:is-hidden={displayEditForm}>
            {achievement.attributes.name}
          </span>
          <svg class="fa item-edit fill-primary no-hover" class:is-hidden={displayEditForm}
            on:click={toggleFormDisplay}>
            <use href="../images/fontawesome-sprite.svg#regular-edit" />
          </svg>
        </h1>
      </div>
    </div>

    {#if displaySavedStatus}
      <div class="columns" out:fade="{{delay: 2000, duration: 200}}">
        <div class="column is-12 saved-collection">
          <svg class="fa saved">
            <use href="../images/fontawesome-sprite.svg#solid-check-circle" />
          </svg>
          Updated !
        </div>
      </div>
    {/if}


    <h1 class="title is-5 byproduct-title"
      class:is-disabled={!relation}>
      <svg class="chevron" on:click={() => toggleSection('conditions', true)}
        class:is-hidden={isExpandedSection.conditions}>
        <use href="../images/fontawesome-sprite.svg#solid-chevron-double-right" />
      </svg>
      <svg class="chevron" on:click={() => toggleSection('conditions', false)}
        class:is-hidden={!isExpandedSection.conditions}>
        <use href="../images/fontawesome-sprite.svg#solid-chevron-double-down" />
      </svg>
      <svg class="twemoji">
        <use href="../images/twemoji-sprite.svg#twisted_rightwards_arrows" />
      </svg>
      Conditions
      {#if relation}
        <span class="quantity">({relation.relationships.conditions.data.length})</span>
      {/if}
    </h1>
    {#if isExpandedSection.conditions}
      {#if relation !== null}
       <Relation
        {relation}
        formPrefix={undefined} />
      {:else}
        <p class="no-conditions">
          No conditions yet
        </p>
      {/if}
    {/if}


    <h1 class="title is-5 byproduct-title">
      <svg class="chevron" on:click={() => toggleSection('rewards', true)}
        class:is-hidden={isExpandedSection.rewards}>
        <use href="../images/fontawesome-sprite.svg#solid-chevron-double-right" />
      </svg>
      <svg class="chevron" on:click={() => toggleSection('rewards', false)}
        class:is-hidden={!isExpandedSection.rewards}>
        <use href="../images/fontawesome-sprite.svg#solid-chevron-double-down" />
      </svg>
      <svg class="twemoji">
        <use href="../images/twemoji-sprite.svg#wrapped_present" />
      </svg>
      Rewards <span class="note">(optional)</span>
    </h1>
    <div class:is-hidden={!isExpandedSection.rewards}>
      <p>TODO</p>
    </div>




    <h1 class="title is-5 byproduct-title"
      class:is-disabled={!achievement.attributes.assets.length}>
      <svg class="chevron" on:click={() => toggleSection('assets', true)}
        class:is-hidden={isExpandedSection.assets}>
        <use href="../images/fontawesome-sprite.svg#solid-chevron-double-right" />
      </svg>
      <svg class="chevron" on:click={() => toggleSection('assets', false)}
        class:is-hidden={!isExpandedSection.assets}>
        <use href="../images/fontawesome-sprite.svg#solid-chevron-double-down" />
      </svg>
      <svg class="twemoji">
        <use href="../images/twemoji-sprite.svg#package" />
      </svg>
      Assets
      {#if achievement.attributes.assets.length}
        <span class="quantity">({achievement.attributes.assets.length})</span>
      {/if}
    </h1>

    {#if isExpandedSection.assets}
      {#if achievement.attributes.assets.length}
        <AssetsIndex assets={achievement.attributes.assets} />
      {:else}
        <p class="no-conditions">
          No assets yet
        </p>
      {/if}
    {/if}
  {/if}




  <!-- Edit Achievement -->
  {#if displayEditForm || !achievement.id}
    <form id="{achievement.id || 'new'}-achievement-form"
        on:submit|preventDefault={saveAchievement}>

      <div class="notification is-danger" class:is-hidden={!error} >
        <button class="delete" on:click|preventDefault={() => flushError()} ></button>
        <h1 class='title is-5'>
          Unable to Update Achievement :
        </h1>
        <ul>
          {#if error}
            {#each Object.entries(error) as [ key, ar ]}
              <li>{key} : {ar}</li>
            {/each}
          {/if}
        </ul>
      </div>


      <h1 class="title is-5 byproduct-title">
        <svg class="twemoji">
          <use href="../images/twemoji-sprite.svg#card_file_box" />
        </svg>
        Properties
      </h1>

      <div class="field is-horizontal">
        <div class="field-label is-normal">
          <label class="label">Name :</label>
        </div>
        <div class="field-body">
          <div class="field">
            <input class="input reasonable-width" type="text" name="achievement[name]"
              bind:value={achievement.attributes.name} placeholder="Achievement name">
          </div>
        </div>
      </div>

      <h1 class="title is-5 byproduct-title">
        <svg class="twemoji">
          <use href="../images/twemoji-sprite.svg#twisted_rightwards_arrows" />
        </svg>
        Conditions
      </h1>
      <div class="content">
        <ul class="help">
          <li>
            An Achievement can only be unlocked once <em>per Player</em>.
          </li>
          <li>
            Set below the conditions Players need to meet to unlock the Achievement.
          </li>
          <li>
            Depending on what you configure below, not ALL the conditions have to be met
            for the Achievement to be granted.<br />
            At least one condition has to be met and maximum all the conditions.
          </li>
          <li>
            Make sure you have at least one condition of "Action trigger" type otherwise the
            Achievement will never be hooked!
          </li>
        </ul>
      </div>

      {#if achievement.id}
        {#if relation !== null}
          <Relation 
            {relation}
            formPrefix="achievement[relation_attributes]"
            on:message={updateRelation}/>
        {:else}
          <Relation formPrefix="achievement[relation_attributes]"
            on:message={updateRelation}/>
        {/if}
      {:else}
        <Relation formPrefix="achievement[relation_attributes]"
            on:message={updateRelation}/>
      {/if}


      <h1 class="title is-5 byproduct-title">
        <svg class="twemoji">
          <use href="../images/twemoji-sprite.svg#wrapped_present" />
        </svg>
        Rewards <span class="note">(optional)</span>
      </h1>
      <div>
        <p>TODO</p>
      </div>



      <h1 class="title is-5 byproduct-title">
        <svg class="twemoji">
          <use href="../images/twemoji-sprite.svg#package" />
        </svg>
        Assets
        <span class="note">(optional)</span>
      </h1>
      <div class="content">
        <ul class="help">
          <li>
            Assets are key-value entries you can associate with an Achievement.
          </li>
          <li>
            Everytime an Achievement will be involved, its associated assets will be returned as well.
          </li>
          <li>
            You can have multiple assets per Achievement, carrying any information you want.
          </li>
          <li>
            See assets
            <a href="https://doc/place2be.io/assets" target="_blank">
              <span>Doc</span>
              <svg class="fa fill-primary no-hover">
                <use href="../images/fontawesome-sprite.svg#regular-external-link-square" />
              </svg>
            </a>
            for common use cases and examples.
          </li>
        </ul>
      </div>

      <AssetsForm assets={achievement.attributes.assets} formPrefix="achievement"/>

      <div class="columns is-vcentered">
        <div class="column is-narrow">
          <p class="help">
            Need help? See 
            <a href="https://doc/place2be.io/achievements" target="_blank">
              <span>Doc</span>
              <svg class="fa fill-primary no-hover">
                <use href="../images/fontawesome-sprite.svg#regular-external-link-square" />
              </svg>
            </a>
          </p>
        </div>
        <div class="column">
          <div class="buttons">
            <button class="button is-primary">
            {#if !achievement.id}
              Create
            {:else}
              Update
            {/if}
            </button>
            {#if achievement.id}
              <button class="button is-primary is-light"
                on:click|preventDefault={resetAchievement}>
                Cancel
              </button>
              <button class="button is-danger"
                on:click|preventDefault={destroyAchievement}>
                Delete
              </button>
            {/if}
          </div>
        </div>
      </div>
    </form>
  {/if}
</div>

<style lang="scss">
  .item-box {
    /* Desktop */
    @media screen and (min-width: 768px) {
      max-width: 90%;
    }
  }
  button.is-danger {
    color: #cb2431 !important;
    background: white !important;
    border: 1px solid #cb2431 !important;
  }
</style>