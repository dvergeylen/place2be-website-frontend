<script>
  import { getContext, createEventDispatcher } from 'svelte';
  import { createUrl } from '../../../javascripts/utils/helpers';
  import { postFormData } from '../../../javascripts/utils/helpers';
  import { game } from '../../../javascripts/stores/gameStore';
  let error = null;

  const dispatch = createEventDispatcher();
  const apiProtocol = getContext('apiProtocol');
  const apiHost = getContext('apiHost');
  const userId = getContext('userId');

  async function handleSubmit(path, formId) {
    const url = createUrl(apiProtocol, apiHost, ...path);
    const formData = new FormData(document.getElementById(formId));
    const res = await postFormData(url, formData, 'PUT');

    if (!res.ok) {
      const t = await res.text();
      error = JSON.parse(t);
    } else {
      /* Update Game Store with new content */
      const newGame = await res.json();
      game.set(newGame.data);

      /* Update Dashboard's game List */
      dispatch('message', {
        gameUrl: newGame.data.links.self,
        updateGameList: true,
      });
    }
  }

  function handleUpdate() {
    handleSubmit(['users', userId, 'games', $game.id], 'settings-form');
  }

  function flushError() {
    error = null;
  }
</script>

{#if !$game}
  <div class="has-vcentered-content">
      <svg class="fa rotating">
        <use href="../images/fontawesome-sprite.svg#regular-sync-alt" />
      </svg>
      <p class="left-spaced">Loading Game Settings</p>
    </div>
{:else}
  <form id="settings-form" on:submit|preventDefault={handleUpdate}>
    <div class="notification is-danger" class:is-hidden={!error} >
      <button class="delete" on:click|preventDefault={() => flushError()} ></button>
      <h1 class='title is-5'>
        Unable to Update Game :
      </h1>
      <ul>
        {#if error}
          {#each Object.entries(error) as [ key, ar ]}
            <li>{key} : {ar}</li>
          {/each}
        {/if}
      </ul>
    </div>

    <div class="field">
      <label class="label">
        Game Name
        <span class="mandatory">*</span>
      </label>
      <div class="control">
        <input name="game[name]" class="input reasonable-width" type="text"
          value={$game['attributes']['name']}>
      </div>
    </div>

    <div class="field">
      <label class="label">
        Description
        <span class="note">(optional)</span>
      </label>
      <div class="control">
        <input name="game[description]" class="input" type="text"
          value={$game['attributes']['description']}>
      </div>
      <p class="help">Game and description won't be visible to your players.</p>
    </div>

    <button class="button is-link">Update Settings</button>
  </form>
{/if}