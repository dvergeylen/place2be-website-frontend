<script>
  import { createEventDispatcher } from 'svelte';
  export let gameList;

  const dispatch = createEventDispatcher();

  function updateGameUrl(gameUrl) {
    dispatch('message', {
      gameUrl,
    });
  }
</script>

<div class="content">
  {#await gameList}
    <div class="has-vcentered-content">
      <svg class="fa rotating">
        <use href="../images/fontawesome-sprite.svg#regular-sync-alt" />
      </svg>
      <p class="left-spaced">Loading Game List</p>
    </div>
  {:then games}
    {#if games.length == 0}
      <p><em>You don't have games yet.</em></p>
    {:else}
      <ul>
        {#each games as game}
          <li>
            <a href={game.links.self} on:click|preventDefault={() => updateGameUrl(game.links.self)}>
              {game.attributes.name}
            </a>
          </li>
        {/each}
      </ul>
    {/if}
  {:catch error}
    <p style="color: red">{error.message}</p>
  {/await}
</div>

<style lang='scss'>
  .fa {
    width: 1em;
  }
</style>