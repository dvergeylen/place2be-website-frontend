<script>
  import { fetchData } from '../../javascripts/utils/helpers';
  import GameList from './GameList.svelte';
  import GameContent from './GameContent.svelte';
  export let token;
  export let claims;
  let gameList;
  let gameId;

  async function getContent(token, uid) {
    const res = await fetchData(token, `http://localhost:3000/api/v1/users/${uid}/games`);
    const resJson = await res.json();
    return resJson.data;
  };

  function setGameId(id) {
    gameId = id;
  }

  $: if (token && claims) {
    gameList = getContent(token, claims.sub);
  }
</script>


 <div class="columns">
  <div class="column is-2">
    <h1 class="title is-5">
      Games :
    </h1>
    <button class="button is-link is-outlined fill-primary"
      on:click={async () => setGameId('new')}>
      <span class="icon is-small">
        <svg class="fa">
          <use href="../images/fontawesome-sprite.svg#light-sparkles" />
        </svg>
      </span>
      <span>
        New Game
      </span>
    </button>
    <GameList {gameList} />
  </div>
  <div class="column">
    <GameContent {gameId} />
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