<script>
  import { getContext, createEventDispatcher } from 'svelte';
  import { createUrl } from '../../../../javascripts/utils/helpers';
  import { postFormData } from '../../../../javascripts/utils/helpers';
  import { game } from '../../../../javascripts/stores/gameStore';
  import { savingStatus } from '../../../../javascripts/stores/savingStore';
  export let action = {
    attributes: {
      name: '',
      value_type: 'boolean',
      tags: '',
    }
  };

  const dispatch = createEventDispatcher();
  const apiProtocol = getContext('apiProtocol');
  const apiHost = getContext('apiHost');
  const userId = getContext('userId');

  let error = null;
  let tags;
  let displayNameInput = false;

  async function saveAction() {
    savingStatus.set('saving');
    let path, method;

    if (action.id) {
      path = ['users', userId, 'games', $game.id, 'actions', action.id];
      method = 'PUT';
    } else {
      path = ['users', userId, 'games', $game.id, 'actions'];
      method = 'POST';
    }
    const url = createUrl(apiProtocol, apiHost, ...path);
    const formData = new FormData(document.getElementById(`${action.id || 'new'}-action-form`));
    const res = await postFormData(url, formData, method);

    if (!res.ok) {
      const t = await res.text();
      error = JSON.parse(t);
      savingStatus.set('failed');
    } else {
      /* Update action (update) or Update actions list (new) */
      savingStatus.set('saved');
      if (action.id) {
        const updatedAction = await res.json();
        action = updatedAction.data;
      } else {
        const actions = await res.json();
        dispatch('message', {
          actions: actions.data,
        });
      }
    }
  }

  async function destroyAction() {
    savingStatus.set('saving');
    const path = ['users', userId, 'games', $game.id, 'actions', action.id];
    const url = createUrl(apiProtocol, apiHost, ...path);
    const res = await postFormData(url, {}, 'DELETE');

    if (!res.ok) {
      const t = await res.text();
      error = JSON.parse(t);
      savingStatus.set('failed');
    } else {
      savingStatus.set('saved');

      /* Update actions list */
      const actions = await res.json();
      dispatch('message', {
        actions: actions.data,
      });
    }
  }

  function updateAction() {
    if (action.id) saveAction();
  }

  function toggleEditName() {
    displayNameInput = !displayNameInput;
  }

  function flushError() {
    error = null;
  }
</script>

<form id="{action.id || 'new'}-action-form" on:change={updateAction}
  on:submit|preventDefault={saveAction}>
  <div class='item-box'>
    {#if action.id}
      <div class="columns is-mobile">
        <div class="column">
          <h1 id="action-name" class="title is-5 has-vcentered-text">
            <span class:is-hidden={displayNameInput}>
              {action.attributes.name}
            </span>
            <input class="input reasonable-width" type="text" name="act[name]"
              bind:value={action.attributes.name}
            class:is-hidden={!displayNameInput}>

            <svg class="fa name-edit fill-primary no-hover" class:is-hidden={displayNameInput}
              on:click={toggleEditName}>
              <use href="../images/fontawesome-sprite.svg#regular-edit" />
            </svg>
            <svg class="fa name-edit fill-primary no-hover" class:is-hidden={!displayNameInput}
              on:click={toggleEditName}>
              <use href="../images/fontawesome-sprite.svg#regular-check-circle" />
            </svg>
          </h1>
        </div>
          <div class="column is-narrow">
              <svg class="fa" on:click={destroyAction}>
                <use href="../images/fontawesome-sprite.svg#regular-times-circle" />
              </svg>
          </div>
      </div>
    {/if}

    <div class="notification is-danger" class:is-hidden={!error} >
      <button class="delete" on:click|preventDefault={() => flushError()} ></button>
      <h1 class='title is-5'>
        Unable to Update Action :
      </h1>
      <ul>
        {#if error}
          {#each Object.entries(error) as [ key, ar ]}
            <li>{key} : {ar}</li>
          {/each}
        {/if}
      </ul>
    </div>

    <table class="table">
      <tbody>
        {#if !action.id}
          <tr>
            <td class="right">
              Name :
            </td>
            <td>
              <input class="input" type="text" name="act[name]">
            </td>
          </tr>
        {/if}
        <tr>
          <td class="right">
            Value Type :
          </td>
          <td>
            <div class="select">
              <select name="act[value_type]" bind:value={action.attributes.value_type}>
                <option value='boolean'>Boolean (Yes | No)</option>
                <option value='int'>Integer</option>
                <option value='float'>Float</option>
                <option value='string'>String</option>
                <option value='date'>Date</option>
              </select>
            </div>
          </td>
        </tr>
        <tr>
          <td class="right">
            Team Id field :
          </td>
          <td>
            <div class="select">
              <select name="act[team_required]" bind:value={action.attributes.team_required}>
                <option value="false">No, optional</option>
                <option value="true">Yes, required</option>
              </select>
            </div>
          </td>
        </tr>
        <tr>
          <td class="right">
            Tags :
          </td>
          <td>
            <input class="input" type="text" name="act[tags]" bind:value={tags}>
          </td>
        </tr>
        <tr>
          <td>
            <p class="help">
              Need help? See 
              <a href="https://doc/place2be.io/actions" target="_blank">
                <span>Doc</span>
                <svg class="fa fill-primary no-hover">
                  <use href="../images/fontawesome-sprite.svg#regular-external-link-square" />
                </svg>
              </a>
            </p>
          </td>
          <td>
            {#if !action.id}
              <button class="button is-primary">
                Create
              </button>
            {/if}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</form>


<style lang='scss'>
  #action-name {
    margin-top: 0.5em;
    margin-left: 0.5em;
  }
  td {
    vertical-align: middle;
  }
  td.right {
    text-align: right;
  }
  .name-edit {
    height: 0.7em;
    margin-left: 0.2em;
  }
  .fa {
    cursor: pointer;
  }
</style>