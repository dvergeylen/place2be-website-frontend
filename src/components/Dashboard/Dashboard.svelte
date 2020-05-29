<script>
  import { setContext } from 'svelte';
  import { createUrl, fetchData } from '../../javascripts/utils/helpers';
  import GameList from './GameList.svelte';
  import GameContent from './GameContent.svelte';
  export let apiProtocol;
  export let apiHost;
  export let userId = undefined;
  let gameList;
  let gameUrl;

  async function getContent(id) {
    const url = createUrl(apiProtocol, apiHost, 'users', id, 'games');
    const res = await fetchData(url);
    const resJson = await res.json();
    return resJson.data;
  };

  function setGameUrl(url) {
    gameUrl = url;
  }

  async function handleNewGameUrl(event) {
    if (event.detail.updateGameList) {
      gameList = await getContent(userId);
    }
    setGameUrl(event.detail.gameUrl);
  }

  $: gameList = getContent(userId);
  $: setContext('apiProtocol', apiProtocol);
  $: setContext('apiHost', apiHost);
  $: setContext('userId', userId);
</script>


 <div class="columns">
  <div class="column is-2">
    <h1 class="title is-5">
      Games :
    </h1>
    <button class="button is-link is-outlined fill-primary"
      on:click={async () => setGameUrl('new')}>
      <span class="icon is-small">
        <svg class="fa">
          <use href="../images/fontawesome-sprite.svg#light-sparkles" />
        </svg>
      </span>
      <span>
        New Game
      </span>
    </button>
    <GameList {gameList} on:message={handleNewGameUrl} />
  </div>
  <div class="column">
    <GameContent {gameUrl} on:message={handleNewGameUrl} />
  </div>
</div>

<style lang='scss'>
  .fa {
    width: 1em;
  }
  .fill-primary {
    fill: #0096df;
    &:hover {
      fill: white;
    }
  }
</style>