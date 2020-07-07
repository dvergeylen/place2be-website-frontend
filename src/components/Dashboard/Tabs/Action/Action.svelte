<script>
  import { getContext, createEventDispatcher, onDestroy } from 'svelte';
  import { fade } from 'svelte/transition';
  import { createUrl } from '../../../../javascripts/utils/helpers';
  import { fetchData, postFormData } from '../../../../javascripts/utils/helpers';
  import Relation from '../SharedComps/Relation/Relation.svelte';
  import { game } from '../../../../javascripts/stores/gameStore';
  import { savingStatus } from '../../../../javascripts/stores/savingStore';
  export let action = {
    attributes: {
      name: '',
      actionType: 'boolean',
      tags: [],
    }
  };
  let relation;
  let isExpandedSection = {
    conditions: false,
  }

  const dispatch = createEventDispatcher();
  const apiProtocol = getContext('apiProtocol');
  const apiHost = getContext('apiHost');
  const userId = getContext('userId');

  let error = null;
  let displayEditForm = false;
  let displaySavedStatus = false;
  let displaySavedStatusTimeout;

  async function saveAction() {
    savingStatus.set('saving');
    let path, method;

    if (action.id) {
      path = ['users', userId, 'games', $game.data.id, 'actions', action.id];
      method = 'PUT';
    } else {
      path = ['users', userId, 'games', $game.data.id, 'actions'];
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
      savingStatus.set('saved');
      error = null;
      resetFormDisplay();
      displaySavedBanner();

      /* Dispatch new/updated action to Collection's list */
      const updatedAction = await res.json();
      dispatch('updateCollection', {
        action: updatedAction.data,
        included: updatedAction.included,
        deprecatedIncludedIds:
          updatedAction.included.map((o) => `${o.type}#${o.id}`)
            .concat([`action#${updatedAction.data.id}`]),
      });
    }
  }

  async function destroyAction() {
    savingStatus.set('saving');
    const path = ['users', userId, 'games', $game.data.id, 'actions', action.id];
    const url = createUrl(apiProtocol, apiHost, ...path);
    const res = await postFormData(url, {}, 'DELETE');

    if (res.status !== 204) {
      const t = await res.text();
      error = JSON.parse(t);
      savingStatus.set('failed');
    } else {
      savingStatus.set('saved');

      /* Update actions list */
      dispatch('removeCollectionMember', {
        action: {
          id: action.id,
        },
      });
    }
  }

  /* Reload the original Action Data if user hits the Cancel button */
  async function resetAction() {
    let path, method;
    path = ['users', userId, 'games', $game.data.id, 'actions', action.id];

    const url = createUrl(apiProtocol, apiHost, ...path);
    const res = await fetchData(url);

    if (res.ok) {
      const updatedAction = await res.json();
      dispatch('updateCollection', {
        action: updatedAction.data,
        included: [],
        deprecatedIncludedIds: [`action#${updatedAction.data.id}`],
      });
    }
    resetFormDisplay();
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
        result = 'Boolean (Pass | Fail)';
        break;
      case 'int':
        result = 'Integer';
        break;
      case 'float':
        result = 'Float';
        break;
      case 'string':
        result = 'String';
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

  function toggleSection(key, value) {
    isExpandedSection[key] = value;
  }

  function displaySavedBanner() {
    displaySavedStatus = true;
    displaySavedStatusTimeout = setTimeout(() => {
      displaySavedStatus = false;
    }, 1000);
  }

  function flushError() {
    error = null;
  }

  onDestroy(() => {
    clearTimeout(displaySavedStatusTimeout);
  });

  // TODO: replace with conditional chaining support:
  // https://github.com/sveltejs/svelte/commit/2450dd1ff08491739f124bcdf5131a2e7af52bcb
  // not released on svelte at this time of writing.
  $: relation = action.relationships &&
             action.relationships.relation.data &&
             $game.included.find((e) => (
    e.id === action.relationships.relation.data.id &&
    e.type === action.relationships.relation.data.type
  ));
</script>

<div class='item-box'>

  <!-- Show Action -->
  <div class:is-hidden={displayEditForm || !action.id}>
    <div class="columns is-mobile">
      <div class="column">
        <h1 class="title is-4 has-vcentered-text item-name">
          <svg class="twemoji">
            <use href="../images/twemoji-sprite.svg#high_voltage_sign" />
          </svg>
          <span class:is-hidden={displayEditForm}>
            {action.attributes.name}
          </span>
          <svg class="fa item-edit fill-primary no-hover" class:is-hidden={displayEditForm}
            on:click={toggleFormDisplay}>
            <use href="../images/fontawesome-sprite.svg#regular-edit" />
          </svg>
        </h1>
      </div>
    </div>

  {#if displaySavedStatus}
    <div class="columns" out:fade="{{delay: 2000, duration: 200}}">
      <div class="column is-12 saved-collection">
        <svg class="fa saved">
          <use href="../images/fontawesome-sprite.svg#solid-check-circle" />
        </svg>
        Updated !
      </div>
    </div>
  {/if}

    <table class="table">
      <tbody>
        <tr>
          <td class="right">
            Score Type :
          </td>
          <td class="is-value">
            {valueTypePrettify(action.attributes.actionType)}
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

    <h1 class="title is-5 byproduct-title">
      <svg class="chevron" on:click={() => toggleSection('conditions', true)}
        class:is-hidden={isExpandedSection.conditions}>
        <use href="../images/fontawesome-sprite.svg#solid-chevron-double-right" />
      </svg>
      <svg class="chevron" on:click={() => toggleSection('conditions', false)}
        class:is-hidden={!isExpandedSection.conditions}>
        <use href="../images/fontawesome-sprite.svg#solid-chevron-double-down" />
      </svg>
      <svg class="twemoji">
        <use href="../images/twemoji-sprite.svg#twisted_rightwards_arrows" />
      </svg>
      Conditions
    </h1>
    {#if isExpandedSection.conditions}
      {#if relation !== null}
       <Relation
        {relation}
        formPrefix={undefined} />
      {:else}
        <p class="no-conditions">
          No conditions yet
        </p>
      {/if}
    {/if}
  </div>

  <!-- Edit Action -->
  <div class:is-hidden={!displayEditForm && action.id}>
    <form id="{action.id || 'new'}-action-form"
      on:submit|preventDefault={saveAction}>

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

        <h1 class="title is-5 byproduct-title">
          <svg class="twemoji">
            <use href="../images/twemoji-sprite.svg#card_file_box" />
          </svg>
          Properties :
        </h1>

        <div class="field is-horizontal">
          <div class="field-label is-normal">
            <label class="label">Name :</label>
          </div>
          <div class="field-body">
            <div class="field">
              <input class="input reasonable-width" type="text" name="act[name]"
                bind:value={action.attributes.name} placeholder="Action name">
            </div>
          </div>
        </div>

        <div class="field is-horizontal">
          <div class="field-label is-normal">
            <label class="label">Score Type :</label>
          </div>
          <div class="field-body">
            <div class="field">
              <div class="select">
                <select name="act[action_type]" bind:value={action.attributes.actionType}>
                  <option value='boolean'>Boolean (Pass | Fail)</option>
                  <option value='int'>Integer</option>
                  <option value='float'>Float</option>
                  <option value='string'>String</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div class="field is-horizontal">
          <div class="field-label is-normal">
            <label class="label">Team Id field :</label>
          </div>
          <div class="field-body">
            <div class="field">
              <div class="select">
                <select name="act[team_required]" bind:value={action.attributes.team_required}>
                  <option value="false">No, optional</option>
                  <option value="true">Yes, required</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div class="field is-horizontal">
          <div class="field-label is-normal">
            <label class="label">Tags :</label>
          </div>
          <div class="field-body">
            <div class="field">
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
            </div>
          </div>
        </div>

      <div class="columns is-vcentered">
        <div class="column is-narrow">
          <p class="help">
            Need help? See 
            <a href="https://doc/place2be.io/actions" target="_blank">
              <span>Doc</span>
              <svg class="fa fill-primary no-hover">
                <use href="../images/fontawesome-sprite.svg#regular-external-link-square" />
              </svg>
            </a>
          </p>
        </div>
        <div class="column">
          <div class="buttons">
            <button class="button is-primary">
            {#if !action.id}
              Create
            {:else}
              Update
            {/if}
            </button>
            {#if action.id}
              <button class="button is-primary is-light"
                on:click|preventDefault={resetAction}>
                Cancel
              </button>
              <button class="button is-danger"
                on:click|preventDefault={destroyAction}>
                Delete
              </button>
            {/if}
          </div>
        </div>
      </div>
    </form>
  </div>
</div>


<style lang='scss'>
  input.new-tag {
    max-width: 200px;
    margin-right: 1em;
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
  button.is-danger {
    color: #cb2431 !important;
    background: white !important;
    border: 1px solid #cb2431 !important;
  }
</style>