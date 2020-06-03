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
      <article class="panel is-primary">
        <p class="panel-heading">
          Your Games :
        </p>
        <a href="javascript:void(0)" class="panel-block fill-primary"
          on:click|preventDefault={async () => updateGameUrl('new')}>
          <span class="panel-icon">
            <svg class="fa">
              <use href="../images/fontawesome-sprite.svg#light-sparkles" />
            </svg>
          </span>
          <span>
            New Game
          </span>
        </a>
        {#each games as game}
          <a href={game.links.self} on:click|preventDefault={() => updateGameUrl(game.links.self)}
            class="panel-block">
            <span class="panel-icon">
              <svg class="fa">
                <use href="../images/fontawesome-sprite.svg#light-sparkles" />
              </svg>
            </span>
            {game.attributes.name}
          </a>
        {/each}
      </article>
    {/if}
  {:catch error}
    <p class="error">{error.message}</p>
  {/await}
</div>

<style lang='scss'>
  .fa {
    width: 1em;
    height: 1em;
  }
</style>