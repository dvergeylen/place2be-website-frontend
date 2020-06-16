<script>
  import { getContext, createEventDispatcher } from 'svelte';
  import { createUrl } from '../../../javascripts/utils/helpers';
  import { postFormData } from '../../../javascripts/utils/helpers';
  import { game } from '../../../javascripts/stores/gameStore';
  import { savingStatus } from '../../../javascripts/stores/savingStore';
  let error = null;

  const dispatch = createEventDispatcher();
  const apiProtocol = getContext('apiProtocol');
  const apiHost = getContext('apiHost');
  const userId = getContext('userId');

  async function handleSubmit(path, formId) {
    const url = createUrl(apiProtocol, apiHost, ...path);
    const formData = new FormData(document.getElementById(formId));

    savingStatus.set('saving');
    const res = await postFormData(url, formData, 'PUT');

    if (!res.ok) {
      const t = await res.text();
      error = JSON.parse(t);
      savingStatus.set('failed');
    } else {
      savingStatus.set('saved');

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

  function handleDanger() {
    const conf = confirm("Are you sure?");
    if (!conf)
      return;

    handleSubmit(['users', userId, 'games', $game.id], 'danger-form');
  }

  async function handleDestroy() {
    const conf = confirm("Are you sure? \
    Once you delete a game, there is no going back. Please be certain!");
    if (!conf)
      return;

    const path = ['users', userId, 'games', $game.id];
    const url = createUrl(apiProtocol, apiHost, ...path);
    const res = await postFormData(url, {}, 'DELETE');

    if (!res.ok) {
      const t = await res.text();
      error = JSON.parse(t);
    } else {
      /* Reset Game Store content */
      game.set(null);

      /* Update Dashboard's game List */
      dispatch('message', {
        gameUrl: undefined,
        updateGameList: true,
      });
    }
  }

  function addNamespace() {
    const ns = document.getElementById('new-namespace');
    if (!$game['attributes']['namespaces'].includes(ns.value)) {
      game.update(g => ({
        ...g,
        attributes: {
          ...g['attributes'],
          namespaces: [...g['attributes']['namespaces'], ns.value],
        },
      }));
    }
    ns.value = '';
  }

  function removeNamespace(namespace) {
    game.update(g => ({
      ...g,
      attributes: {
        ...g['attributes'],
        namespaces: g['attributes']['namespaces'].filter((e) => e !== namespace),
      },
    }));
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
      </label>
      <div class="control">
        <input name="game[name]" class="input reasonable-width" type="text"
          value={$game['attributes']['name']}>
      </div>
    </div>

    <div class="field">
      <label class="label">
        Description
      </label>
      <div class="control">
        <input name="game[description]" class="input" type="text"
          value={$game['attributes']['description']}>
      </div>
      <p class="help">Game and description won't be visible to your players.</p>
    </div>

    <div class="field">
      <label class="label">
        Namespaces
      </label>
      <div class="field is-grouped is-grouped-multiline has-vcentered-content">
        {#each $game['attributes']['namespaces'] as namespace, i (i)}
          <div class="control">
            <input name="game[namespaces][]" class="input" type="hidden"
              value={namespace}>
            <div class="tags has-addons">
              {#if namespace == 'default'}
                <span class="tag is-light">
                  {namespace}
                </span>
              {:else}
                <span class="tag is-info">
                  {namespace}
                </span>
                <span class="tag is-delete" on:click={removeNamespace(namespace)}>
                </span>
              {/if}
            </div>
          </div>
        {/each}
          <input id="new-namespace" class="input is-small" type="text"
            placeholder="New">
          <button class="button is-primary is-outlined is-small"
            on:click|preventDefault={addNamespace}>
            Add
          </button>
      </div>
    </div>

    <button class="button is-link save">Update Settings</button>
  </form>

  <hr>

  <h1 class="title is-4">Danger Zone :</h1>
  <form id="danger-form" on:submit|preventDefault={handleDanger}>
    <div class="field">
      <input name="game[archived]" class="input" type="hidden"
          value={!$game['attributes']['archived']}>
      <button class="button is-danger is-outlined"
        class:is-hidden={$game.attributes.archived}>Archive this Game</button>
      <button class="button is-danger is-outlined"
        class:is-hidden={!$game.attributes.archived}>Reactivate this Game</button>
      <p class="help">Once you archive a game, no player will be able to access it anymore. Please be certain!</p>
    </div>
  </form>

  <div class="field">
    <button class="button is-danger is-outlined" on:click|preventDefault={handleDestroy}>
      Delete this Game
    </button>
    <p class="help">Once you delete a game, there is no going back. Please be certain!</p>
  </div>
{/if}

<style lang=scss>
  button.is-danger {
    color: #cb2431 !important;
    background: white !important;
    border: 1px solid #cb2431 !important;
  }
  button.save {
    margin-top: 2em;
  }
  input#new-namespace {
    max-width: 200px;
    margin-right: 1em;
  }
  .is-delete {
    cursor: pointer;
  }
  .control:not(:last-child) {
    margin-bottom: 0.75rem;
    margin-top: 0.75rem;
    margin-right: 0.75rem;
  }
</style>