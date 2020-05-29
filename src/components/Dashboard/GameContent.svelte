<script>
  import NewGame from './NewGame.svelte';
  import GameDetails from './GameDetails.svelte';
  export let gameUrl = undefined;
</script>

<div id="game-content">
  {#if !gameUrl}
    <p>← Create a new game</p>
  {:else if gameUrl === 'new'}
    <NewGame on:message/>
  {:else}
    <GameDetails {gameUrl} />
  {/if}
</div>

<style lang='scss'>
  div#game-content {
    max-width:1152px;
  }
</style>