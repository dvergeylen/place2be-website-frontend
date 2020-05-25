<script>
  export let gameList;
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
      <p>Game List comes here</p>
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