<script>
  import { getContext, createEventDispatcher } from 'svelte';
  import { createUrl } from '../../../../javascripts/utils/helpers';
  import { postFormData } from '../../../../javascripts/utils/helpers';
  import { game } from '../../../../javascripts/stores/gameStore';
  import { savingStatus } from '../../../../javascripts/stores/savingStore';
  export let action = {
    attributes: {
      name: '',
      action_type: 'boolean',
      tags: [],
    }
  };

  const dispatch = createEventDispatcher();
  const apiProtocol = getContext('apiProtocol');
  const apiHost = getContext('apiHost');
  const userId = getContext('userId');

  let error = null;
  let displayEditForm = false;

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
        resetFormDisplay();
      } else {
        const actions = await res.json();
        dispatch('message', {
          actions: actions.data,
        });
      }
    }
  }

  async function destroyAction() {
    const conf = confirm("Are you sure? \
    Once you delete an Action, there is no going back. Please be certain!");
    if (!conf)
      return;

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

  function removeTag(tag) {
    action = {
      ...action,
      attributes: {
        ...action.attributes,
        tags: action.attributes.tags.filter((t) => t !== tag),
      },
    };
  }

  function addTag(evt) {
    const tag = evt.target.parentElement.querySelector('input.new-tag').value;
    if (tag.length && !action.attributes.tags.includes(tag)) {
      action = {
        ...action,
        attributes: {
          ...action.attributes,
          tags: [...action.attributes.tags, tag],
        },
      };
    }
  }

  function valueTypePrettify(val) {
    let result = 'Unknown';

    switch(val) {
      case 'boolean':
        result = 'Boolean (Yes | No)';
        break;
      case 'int':
        result = 'Integer';
        break;
      case 'float':
        result = 'Float';
        break;
      case 'string':
        result = 'String';
        break;
      case 'shortlist':
        result = 'shortlist';
    }
    return result;
  }

  function teamIdPrettify(val) {
    let result = 'Unknown';

    switch(val) {
      case false:
        result = 'No, optional';
        break;
      case true:
        result = 'Yes, required';
    }
    return result;
  }

  function toggleFormDisplay() {
    displayEditForm = !displayEditForm;
  }

  function resetFormDisplay() {
    displayEditForm = false;
  }

  function flushError() {
    error = null;
  }
</script>

<div class='item-box'>

  <!-- Show Action -->
  <div class:is-hidden={displayEditForm || !action.id}>
    <div class="columns is-mobile">
      <div class="column">
        <h1 id="action-name" class="title is-5 has-vcentered-text">
          <span class:is-hidden={displayEditForm}>
            {action.attributes.name}
          </span>
          <svg class="fa name-edit fill-primary no-hover" class:is-hidden={displayEditForm}
            on:click={toggleFormDisplay}>
            <use href="../images/fontawesome-sprite.svg#regular-edit" />
          </svg>
        </h1>
      </div>
    </div>

    <table class="table">
      <tbody>
        <tr>
          <td class="right">
            Value Type :
          </td>
          <td class="is-value">
            {valueTypePrettify(action.attributes.action_type)}
          </td>
        </tr>
        <tr>
          <td class="right">
            Team Id field :
          </td>
          <td class="is-value">
            {teamIdPrettify(action.attributes.team_required)}
          </td>
        </tr>
        <tr>
          <td class="right">
            Tags :
          </td>
          <td class="is-value">
            {#if !action.attributes.tags.length}
              --
            {:else}
              <div class="tags">
                {#each action.attributes.tags as tag}
                  <span class="tag is-link">{tag}</span>
                {/each}
              </div>
            {/if}
          </td>
        </tr>
        <tr>
          <td>
          </td>
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
        </tr>
      </tbody>
    </table>
  </div>

  <!-- Edit Action -->
  <div class:is-hidden={!displayEditForm && action.id}>
    <form id="{action.id || 'new'}-action-form"
      on:submit|preventDefault={saveAction}>

        <div class="columns is-mobile">
          <div class="column">
            <h1 id="action-name" class="title is-5 has-vcentered-text">
              <input class="input reasonable-width" type="text" name="act[name]"
                bind:value={action.attributes.name} placeholder="Action name">
            </h1>
          </div>
          {#if action.id}
            <div class="column is-narrow">
                <svg class="fa destroy" on:click={destroyAction}>
                  <use href="../images/fontawesome-sprite.svg#regular-times-circle" />
                </svg>
            </div>
          {/if}
        </div>

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

        <table class="table edit">
          <tbody>
            <tr>
              <td class="right">
                Value Type :
              </td>
              <td>
                <div class="select">
                  <select name="act[action_type]" bind:value={action.attributes.action_type}>
                    <option value='boolean'>Boolean (Yes | No)</option>
                    <option value='int'>Integer</option>
                    <option value='float'>Float</option>
                    <option value='string'>String</option>
                    <option value='shortlist'>Shortlist</option>
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
                <div class="field is-grouped is-grouped-multiline has-vcentered-content">
                  {#each action.attributes.tags as tag, i (i)}
                    <div class="control">
                      <input name="act[tags][]" class="input" type="hidden"
                        value={tag}>
                      <div class="tags has-addons">
                        <span class="tag is-info">
                          {tag}
                        </span>
                        <span class="tag is-delete" on:click={() => removeTag(tag)}>
                        </span>
                      </div>
                    </div>
                  {/each}
                    <input class="input is-small new-tag" type="text"
                      placeholder="New tag">
                    <button class="button is-primary is-outlined is-small"
                      on:click|preventDefault={addTag}>
                      Add
                    </button>
                </div>
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
                  <button class="button is-primary">
                  {#if !action.id}
                    Create
                  {:else}
                    Update
                  {/if}
                  </button>
                  {#if action.id}
                    <button class="button is-primary is-light"
                     on:click|preventDefault={resetFormDisplay}>
                      Cancel
                    </button>
                  {/if}
              </td>
            </tr>
          </tbody>
        </table>
    </form>
  </div>
</div>


<style lang='scss'>
  #action-name {
    margin-top: 0.5em;
    margin-left: 0.5em;
  }
  input.new-tag {
    max-width: 200px;
    margin-right: 1em;
  }
  table.edit {
    width: 100%;
    div.field {
      margin-top: 0.5em;
      margin-bottom: 0.5em;
    }
  }
  td {
    vertical-align: middle;
  }
  td.right {
    text-align: right;
  }
  td.is-value {
    color: gray;
    font-style: italic;
  }
  .name-edit {
    height: 0.7em;
    margin-left: 0.2em;
  }
  .fa {
    cursor: pointer;
  }
  svg.destroy {
    fill: brown;
  }
</style>