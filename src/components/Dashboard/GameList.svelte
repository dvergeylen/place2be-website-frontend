<script>
  import { createEventDispatcher } from 'svelte';
  export let gameList;
  export let gameUrl;

  const dispatch = createEventDispatcher();

  function updateGameUrl(url) {
    dispatch('message', {
      gameUrl: url,
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
    <article class="panel is-primary">
      <p class="panel-heading">
        Your Games :
      </p>
      <a href="javascript:void(0)" class="panel-block fill-primary"
        on:click|preventDefault={async () => updateGameUrl('new')}>
        <span class="panel-icon">
          <svg class="twemoji">
            <use href="../images/twemoji-sprite.svg#rocket" />
          </svg>
        </span>
        <span>
          New Game
        </span>
      </a>
      {#each games as game}
        <a href={game.links.self} on:click|preventDefault={() => updateGameUrl(game.links.self)}
          class="panel-block">
          <span class="panel-icon" class:fill-primary={gameUrl === game.links.self}>
            <svg class="twemoji">
              <use href="../images/twemoji-sprite.svg#trophy" />
            </svg>
          </span>
          {game.attributes.name}
        </a>
      {/each}
    </article>
  {:catch error}
    <p class="error">{error.message}</p>
  {/await}
</div>

<style lang='scss'>
  .twemoji {
    width: 1.2em;
    height: 1em;
  }
</style>