<script>
  import { getContext, createEventDispatcher } from 'svelte';
  import { createUrl } from '../../../../javascripts/utils/helpers';
  import { fetchData, postFormData } from '../../../../javascripts/utils/helpers';
  import Relation from './Relation.svelte';
  import { game } from '../../../../javascripts/stores/gameStore';
  import { savingStatus } from '../../../../javascripts/stores/savingStore';

  export let achievement = {
    attributes: [],
  };
  let relationPromise;
  let expertMode;
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
      /* Update achievement (update) or Update achievements list (new) */
      savingStatus.set('saved');
      if (achievement.id) {
        const updatedAchievement = await res.json();
        achievement = updatedAchievement.data;
        resetFormDisplay();
        dispatch('message', {
          achievement,
        });
      } else {
        const achievements = await res.json();
        dispatch('message', {
          achievements: achievements.data,
        });
      }
    }
  }

  async function destroyAchievement() {
    savingStatus.set('saving');
    const path = ['users', userId, 'games', $game.data.id, 'achievements', achievement.id];
    const url = createUrl(apiProtocol, apiHost, ...path);
    const res = await postFormData(url, {}, 'DELETE');

    if (!res.ok) {
      const t = await res.text();
      error = JSON.parse(t);
      savingStatus.set('failed');
    } else {
      savingStatus.set('saved');

      /* Update achievements list */
      const achievements = await res.json();
      dispatch('message', {
        achievements: achievements.data,
      });
    }
  }

  function toggleExpertMode() {
    game.update(g => ({
      ...g,
      attributes: {
        ...g.attributes,
        expertMode: !g.attributes.expertMode,
      },
    }));
  }
  $: expertMode = $game.data.attributes.expertMode;

  function resetFormDisplay() {
    // TODO
  }

  function flushError() {
    error = null;
  }

  $: relationPromise = fetchRelation(achievement);
</script>

<div class='item-box'>
  <form id="{achievement.id || 'new'}-achievement-form"
      on:submit|preventDefault={saveAchievement}>

    <div class="columns is-mobile">
      <div class="column">
        <h1 class="title is-5 has-vcentered-text">
          <input class="input reasonable-width" type="text" name="achievement[name]"
            bind:value={achievement.attributes.name} placeholder="Achievement name">
        </h1>
      </div>

      {#if achievement.id}
        <div class="column is-narrow">
            <svg class="fa fill-destroy" on:click={destroyAchievement}>
              <use href="../images/fontawesome-sprite.svg#regular-times-circle" />
            </svg>
        </div>
      {/if}
    </div>

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

    <h1 class="title is-6 byproduct-title">
      1. Conditions :
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

    <h1 class="title is-6">
      2. Rewards <span class="note">(optional)</span> :
    </h1>
    <h1 class="title is-6">
      3. Assets <span class="note">(optional)</span> :
    </h1>

    <table class="table">
      <tbody>
        <tr class="has-vcentered-content">
          <td>
            <p class="help">
              Need help? See 
              <a href="https://doc/place2be.io/achievements" target="_blank">
                <span>Doc</span>
                <svg class="fa fill-primary no-hover">
                  <use href="../images/fontawesome-sprite.svg#regular-external-link-square" />
                </svg>
              </a>
            </p>
          </td>
          <td>
              <button class="button is-primary">
              {#if !achievement.id}
                Create
              {:else}
                Update
              {/if}
              </button>
              {#if achievement.id}
                <button class="button is-primary is-light"
                  on:click|preventDefault={() => { /* NO OP for now */} }>
                  Cancel
                </button>
              {/if}
          </td>
        </tr>
      </tbody>
    </table>
  </form>
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
</style>