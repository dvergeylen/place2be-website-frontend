<script>
  import NewGame from './NewGame.svelte';
  export let gameId = undefined;
</script>

{#if !gameId}
  <p>← Create a new game</p>
{:else if gameId === 'new'}
  <NewGame />
{:else}
  <p>We should load {gameId}!</p>
{/if}