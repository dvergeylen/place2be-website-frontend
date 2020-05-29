<script>
  import { getContext, createEventDispatcher } from 'svelte';
  import { createUrl, postFormData } from '../../javascripts/utils/helpers';

  const dispatch = createEventDispatcher();
  const apiProtocol = getContext('apiProtocol');
  const apiHost = getContext('apiHost');
  const userId = getContext('userId');

  let error = false;

  async function handleSubmit() {
    const url = createUrl(apiProtocol, apiHost, 'users', userId, 'games');
    const formData = new FormData(document.getElementById('new-game-form'));
    const res = await postFormData(url, formData);

    if (!res.ok) {
      const responseBody = await res.text();
      error = JSON.parse(responseBody);
    } else {
      const responseBody = await res.json();

      /* Update Dashboard's new gameUrl to display */
      dispatch('message', {
        gameUrl: responseBody.data.links.self,
        updateGameList: true,
      });
    }
  }

  function cancel() {
    /* Update Dashboard's new gameUrl to display */
    dispatch('message', {
      gameUrl: undefined,
    });
  }

  function flushError() {
    error = false;
  }
</script>


<div id="new-game">
  <h1 class="title is-4">
    Create a new Game :
  </h1>
  <p>A game contains all actions, achievements, rewards and assets your players can interact with.</p>

  <hr>

  <form id="new-game-form" on:submit|preventDefault={handleSubmit}>
    <div class="notification is-danger" class:is-hidden={!error} >
      <button class="delete" on:click|preventDefault={() => flushError()} ></button>
      <h1 class='title is-5'>
        Unable to Create new Game :
      </h1>
      <ul>
        {#each Object.entries(error) as [ key, ar ]}
          <li>{key} : {ar}</li>
        {/each}
      </ul>
    </div>

    <div class="field">
      <label class="label">
        Game Name
        <span class="mandatory">*</span>
      </label>
      <div class="control">
        <input name="game[name]" class="input reasonable-width" type="text">
      </div>
    </div>

    <div class="field">
      <label class="label">
        Description
        <span class="note">(optional)</span>
      </label>
      <div class="control">
        <input name="game[description]" class="input" type="text">
      </div>
      <p class="help">Game and description won't be visible to your players.</p>
    </div>

    <div class="field is-grouped">
      <div class="control">
        <button class="button is-link">Create</button>
      </div>
      <div class="control">
        <button class="button is-link is-light" on:click|preventDefault={() => cancel()}>Cancel</button>
      </div>
    </div>
  </form>
</div>



<style lang="scss">
  #new-game {
    max-width: 1000px;
  }
  .mandatory {
    color: red;
  }
  .note {
    min-height: 17px;
    margin: 4px 0 2px;
    font-size: 12px;
    color: #586069;
  }
</style>