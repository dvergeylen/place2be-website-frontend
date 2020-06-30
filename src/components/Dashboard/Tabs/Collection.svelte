<script>
  import Resource from './Resource/Resource.svelte';
  import Action from './Action/Action.svelte';
  import Achievement from './Achievement/Achievement.svelte';
  import { fetchData } from '../../../javascripts/utils/helpers';
  import { game } from '../../../javascripts/stores/gameStore';

  export let attributes;
  export let collection;

  const collectionsComponents = {
    actions: Action,
    achievements: Achievement,
    resources: Resource,
  };

  function updateCollection(event) {
    game.update((g) => ({
      ...g,
      included: [
        ...g.included.filter((e) => (
          !(e.type === attributes.name.singular &&
              e.id === event.detail[attributes.name.singular].id)
        )),
        event.detail[attributes.name.singular],
      ],
    }));
  }

  function removeCollectionMember(event) {
    game.update((g) => ({
      ...g,
      included: [
        ...g.included.filter((e) => (
          !(e.type === attributes.name.singular &&
              e.id === event.detail[attributes.name.singular].id)
        )),
      ],
    }));
  }
</script>

{#if collection.length}
  {#each collection as elem (elem.id)}
    <svelte:component this={collectionsComponents[attributes.name.plural]}
      { ...{ [attributes.name.singular]: elem} }
      on:updateCollection={updateCollection}
      on:removeCollectionMember={removeCollectionMember}/>
  {/each}
{:else}
  <p>You don't have {attributes.model.plural} yet! Start by creating one below ↓</p>
{/if}

<hr>
<h1 class="title is-4">
  Create new {attributes.model.singular} :
</h1>
<svelte:component this={collectionsComponents[attributes.name.plural]}
  on:updateCollection={updateCollection}
  on:removeCollectionMember={removeCollectionMember}/>
