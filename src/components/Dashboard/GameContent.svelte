<script>
  import NewGame from './NewGame.svelte';
  export let gameUrl = undefined;
</script>

<div id="game-content">
  {#if !gameUrl}
    <p>← Create a new game</p>
  {:else if gameUrl === 'new'}
    <NewGame on:message/>
  {:else}
    <p>We should load {gameUrl} content!</p>
  {/if}
</div>

<style lang='scss'>
  div#game-content {
    max-width:80%;
  }
</style>