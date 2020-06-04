<script>
  import { setContext } from 'svelte';
  import { createUrl, fetchData } from '../../javascripts/utils/helpers';
  import GameList from './GameList.svelte';
  import NewGame from './NewGame.svelte';
  import GameDetails from './GameDetails.svelte';
  export let apiProtocol;
  export let apiHost;
  export let userId = undefined;
  let gameList;
  let gameUrl;

  async function getUserGamesList(id) {
    const url = createUrl(apiProtocol, apiHost, 'users', id, 'games');
    const res = await fetchData(url);
    const resJson = await res.json();
    return resJson.data;
  };

  async function handleNewGameUrl(event) {
    if (event.detail.updateGameList) {
      gameList = await getUserGamesList(userId);
    }
    gameUrl = event.detail.gameUrl;
  }

  $: gameList = getUserGamesList(userId);
  $: setContext('apiProtocol', apiProtocol);
  $: setContext('apiHost', apiHost);
  $: setContext('userId', userId);
</script>


 <div class="columns">
  <div class="column is-2">
    <GameList {gameList} {gameUrl} on:message={handleNewGameUrl} />
  </div>
  <div class="column">
    <div id="game-content" class="box">
      {#if !gameUrl}
        <p>← Start by hitting the 'New Game' button !
          <svg class="twemoji">
            <use href="../images/twemoji-sprite.svg#party_popper" />
          </svg>
        </p>
      {:else if gameUrl === 'new'}
        <NewGame on:message={handleNewGameUrl} />
      {:else}
        <GameDetails {gameUrl} on:message={handleNewGameUrl} />
      {/if}
    </div>
  </div>
</div>

<style lang='scss'>
  div#game-content {
    max-width:1152px;
  }
</style>