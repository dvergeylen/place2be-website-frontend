<script>
  import Resource from './Resource/Resource.svelte';
  import { fetchData } from '../../../javascripts/utils/helpers';
  import { game } from '../../../javascripts/stores/gameStore';

  let resources = [];

  async function fetchResources(game) {
    const url = game.relationships.resources.links.related;
    const res = await fetchData(url);

    if (res.ok) {
      const resJson = await res.json();
      resources = resJson.data;
    } else {
      error = 'Could not fetch Resources for this game';
    }
  };

  function updateResources(event) {
    resources = event.detail.resources;
  }

  $: if ($game) fetchResources($game);
</script>

{#if !$game}
  <div class="has-vcentered-content">
    <svg class="fa rotating">
      <use href="../images/fontawesome-sprite.svg#regular-sync-alt" />
    </svg>
    <p class="left-spaced">Loading Game Resources</p>
  </div>
{:else}
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
{/if}
