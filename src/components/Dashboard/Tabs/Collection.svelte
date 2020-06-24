<script>
  import Resource from './Resource/Resource.svelte';
  import Action from './Action/Action.svelte';
  import Achievement from './Achievement/Achievement.svelte';
  import { fetchData } from '../../../javascripts/utils/helpers';
  import { game } from '../../../javascripts/stores/gameStore';

  export let attributes;
  let promise;

  const collections = {
    actions: Action,
    achievements: Achievement,
    resources: Resource,
  };

  async function fetchCollection(game, attrs) {
    const url = game.data.relationships[attrs.name.plural].links.related;
    const res = await fetchData(url);

    if (res.ok) {
      const resJson = await res.json();
      return resJson.data;
    } else {
      throw new Error(`Could not fetch ${attrs.model.plural} for this game`);
    }
  };

  function updateCollection(event) {
    promise = event.detail[attributes.name.plural];

    if (event.detail[attributes.name.plural]) {
      game.update((g) => ({
        ...g,
        included: [
          ...g.included.filter((e) => e.type !== attributes.name.singular),
          ...event.detail[attributes.name.plural],
        ].sort((a, b) => parseInt(a.id) - parseInt(b.id)),
      }));

    // event.detail[attributes.name.singular] is present
    } else {
      game.update((g) => ({
        ...g,
        included: [
          ...g.included.filter((e) => (
            !(e.type === attributes.name.singular &&
                e.id === event.detail[attributes.name.singular].id)
          )),
          event.detail[attributes.name.singular],
        ].sort((a, b) => parseInt(a.id) - parseInt(b.id)),
      }));
    }
  }

  $: promise = fetchCollection($game, attributes);
</script>

{#await promise}
  <div class="has-vcentered-content">
    <svg class="fa rotating">
      <use href="../images/fontawesome-sprite.svg#regular-sync-alt" />
    </svg>
    <p class="left-spaced">Loading Game {attributes.model.plural}</p>
  </div>
{:then collection}
  {#if collection.length}
    {#each collection as elem (elem.id)}
      <svelte:component this={collections[attributes.name.plural]}
        { ...{ [attributes.name.singular]: elem} }
        on:message={updateCollection}/>
    {/each}
  {:else}
    <p>You don't have {attributes.model.plural} yet! Start by creating one below ↓</p>
  {/if}

  <hr>
  <h1 class="title is-4">
    Create new {attributes.model.singular} :
  </h1>
  <svelte:component this={collections[attributes.name.plural]}
    on:message={updateCollection}/>
{:catch error}
  <div class="notification is-warning" >
    <p>{error}</p>
  </div>
{/await}
