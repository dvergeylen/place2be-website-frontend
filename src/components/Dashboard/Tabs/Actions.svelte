<script>
  import Action from './Action/Action.svelte';
  import { fetchData } from '../../../javascripts/utils/helpers';
  import { game } from '../../../javascripts/stores/gameStore';

  let actionsPromise;

  async function fetchActions(game) {
    const url = game.relationships.actions.links.related;
    const res = await fetchData(url);

    if (res.ok) {
      const resJson = await res.json();
      return resJson.data;
    } else {
      throw new Error('Could not fetch Actions for this game');
    }
  };

  function updateActions(event) {
    actionsPromise = event.detail.actions;
  }

  $: actionsPromise = fetchActions($game);
</script>

{#await actionsPromise}
  <div class="has-vcentered-content">
    <svg class="fa rotating">
      <use href="../images/fontawesome-sprite.svg#regular-sync-alt" />
    </svg>
    <p class="left-spaced">Loading Game Actions</p>
  </div>
{:then actions}
  {#if actions.length}
    {#each actions as action (action.id)}
      <Action {action} on:message={updateActions}/>
    {/each}
  {:else}
    <p>You don't have Actions  yet! Start by creating one below ↓</p>
  {/if}

  <hr>
  <h1 class="title is-4">
    Create new Action :
  </h1>
  <Action on:message={updateActions}/>
{:catch error}
  <p>{error}</p>
{/await}
