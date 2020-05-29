<script>
  import GameTabs from './GameTabs.svelte';
  export let gameUrl;
</script>

<h1 class="title is-4 has-vcentered-content">
  <svg class="fa">
    <use href="../images/fontawesome-sprite.svg#solid-trophy" />
  </svg>
  <span class="left-spaced">
    Game Title
  </span>
</h1>
<GameTabs/>
<p>We are here {gameUrl} content!</p>

<style>
  .fa {
    width: 1.2em;
    height: 1.2em;
  }
  .left-spaced {
    margin-left: 0.5em;
  }
</style>