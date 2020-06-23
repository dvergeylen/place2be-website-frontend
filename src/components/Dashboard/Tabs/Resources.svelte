<script>
  import Resource from './Resource/Resource.svelte';
  import { fetchData } from '../../../javascripts/utils/helpers';
  import { game } from '../../../javascripts/stores/gameStore';

  let resourcesPromise;

  async function fetchResources(game) {
    const url = game.relationships.resources.links.related;
    const res = await fetchData(url);

    if (res.ok) {
      const resJson = await res.json();
      return resJson.data;
    } else {
      throw new Error('Could not fetch Resources for this game');
    }
  };

  function updateResources(event) {
    resourcesPromise = event.detail.resources;
  }

  $: resourcesPromise = fetchResources($game);
</script>

{#await resourcesPromise}
  <div class="has-vcentered-content">
    <svg class="fa rotating">
      <use href="../images/fontawesome-sprite.svg#regular-sync-alt" />
    </svg>
    <p class="left-spaced">Loading Game Resources</p>
  </div>
{:then resources}
  {#if resources.length}
    {#each resources as resource (resource.id)}
      <Resource {resource} on:message={updateResources}/>
    {/each}
  {:else}
    <p>You don't have Resources yet! Start by creating one below ↓</p>
  {/if}

  <hr>
  <h1 class="title is-4">
    Create new Resource :
  </h1>
  <Resource on:message={updateResources}/>
{:catch error}
  <p>{error}</p>
{/await}
