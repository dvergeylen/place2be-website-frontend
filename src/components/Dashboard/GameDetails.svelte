<script>
  import GameTabs from './GameTabs.svelte';
  export let gameUrl;
</script>

<h1 class="title is-4">Game Title</h1>
<GameTabs/>
<p>We are here {gameUrl} content!</p>