<script>
  import { getContext, createEventDispatcher, onDestroy } from 'svelte';
  import { fade } from 'svelte/transition';
  import { createUrl } from '../../../../javascripts/utils/helpers';
  import { fetchData, postFormData } from '../../../../javascripts/utils/helpers';
  import Relation from './Relation.svelte';
  import AssetsIndex from '../Assets/AssetsIndex.svelte';
  import AssetsForm from '../Assets/AssetsForm.svelte';
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
  let relationPromise;
  let expertMode;
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

  async function fetchRelation(achievement) {
    if (!achievement.relationships)
      return undefined;

    const url = achievement.relationships.relation.links.related;
    const res = await fetchData(url);

    if (res.ok) {
      const resJson = await res.json();
      return resJson;
    } else {
      throw new Error('Could not fetch Condition Set');
    }
  };

  function updateRelation(event) {
    relationPromise = event.detail.relation;
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
      });
    }
    resetFormDisplay();
  }

  function toggleExpertMode() {
    game.update(g => ({
      ...g,
      data: {
        ...g.data,
        attributes: {
          ...g.data.attributes,
          expertMode: !g.data.attributes.expertMode,
        },
      },
    }));
  }
  $: expertMode = $game.data.attributes.expertMode;

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

  relationPromise = fetchRelation(achievement);
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


    <h1 class="title is-5 byproduct-title">
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
    </h1>
    <div class:is-hidden={!isExpandedSection.conditions}>
      {#await relationPromise}
        <p>Loading Conditions...</p>
      {:then relation}
        <Relation {relation} formPrefix={undefined} />
      {:catch relationError}
        <div class="notification is-warning" >
          <p>{relationError}</p>
        </div>
      {/await}
    </div>


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



    {#if achievement.attributes.assets.length}
      <h1 class="title is-5 byproduct-title">
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
        Assets <span class="quantity">({achievement.attributes.assets.length})</span>
      </h1>

      {#if isExpandedSection.assets}
        <AssetsIndex assets={achievement.attributes.assets} />
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
      <p class="help expert-mode" class:is-hidden={expertMode}>
        Need fined grained conditions ? Set
        <a href="javascript:void(0)"
          on:click|preventDefault={() => toggleExpertMode()}>
          Expert Mode
        </a>.
      </p>
      <p class="help expert-mode" class:is-hidden={!expertMode}>
        You are in <strong>Expert Mode</strong>. Too complex? Go back to
        <a href="javascript:void(0)"
          on:click|preventDefault={() => toggleExpertMode()}>
          Normal Mode
        </a>.
      </p>

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
        {#await relationPromise}
          <p>Loading Conditions...</p>
        {:then relation}
          {#if relation.data !== null}
            <Relation {relation} formPrefix="achievement[relation_attributes]"
              on:message={updateRelation}/>
          {:else}
            <Relation formPrefix="achievement[relation_attributes]"
              on:message={updateRelation}/>
          {/if}
        {:catch relationError}
          <div class="notification is-warning" >
            <p>{relationError}</p>
          </div>
        {/await}
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
    .expert-mode {
      margin-bottom: 1em;
    }
  }
  button.is-danger {
    color: #cb2431 !important;
    background: white !important;
    border: 1px solid #cb2431 !important;
  }

  /* Assets part */
  .asset-wrapper {
    border-radius: 0.15em;
    background-color: #f6f8fa;
    margin-bottom: 1em;
    margin-top: 1em;
    padding: 0.5em;
    border: 1px solid #0096df;

    .columns {
      margin-bottom: 0;
    }
  }
  .asset-value {
    color: gray;
    word-break: break-all;

    /* Mobile */
    @media screen and (max-width: 768px) {
      padding-top: 0;
      margin-bottom: 1em;
    }
  }
  .right-desktop {
    /* Desktop */
    @media screen and (min-width: 768px) {
      text-align: right;
    }
  }
  .right {
    text-align: right;
  }
  .namespace-container {
    /* Mobile */
    @media screen and (max-width: 768px) {
      padding-bottom: 0.2em;
      display: inline-flex;
    }
    p {
      margin-right: 0.5em;
    }
  }
</style>