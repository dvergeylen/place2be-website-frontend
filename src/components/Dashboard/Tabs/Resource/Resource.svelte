<script>
  import { getContext, createEventDispatcher, onDestroy } from 'svelte';
  import { fade } from 'svelte/transition';
  import { createUrl } from '../../../../javascripts/utils/helpers';
  import { fetchData, postFormData } from '../../../../javascripts/utils/helpers';
  import { game } from '../../../../javascripts/stores/gameStore';
  import { savingStatus } from '../../../../javascripts/stores/savingStore';
  export let resource = {
    attributes: {
      name: '',
      source: 'virtual',
      assets: [
        {
          key: '',
          tuples: [
            {
              namespaces: $game.data.attributes.namespaces,
              value: '',
            },
          ],
        },
      ],
    }
  };

  const dispatch = createEventDispatcher();
  const apiProtocol = getContext('apiProtocol');
  const apiHost = getContext('apiHost');
  const userId = getContext('userId');

  let error = null;
  let displayEditForm = false;
  let displaySavedStatus = false;
  let displaySavedStatusTimeout;
  let isExpandedSection = {
    assets: false,
  };

  async function saveResource() {
    savingStatus.set('saving');
    let path, method;

    if (resource.id) {
      path = ['users', userId, 'games', $game.data.id, 'resources', resource.id];
      method = 'PUT';
    } else {
      path = ['users', userId, 'games', $game.data.id, 'resources'];
      method = 'POST';
    }
    const url = createUrl(apiProtocol, apiHost, ...path);
    const formData = new FormData(document.getElementById(`${resource.id || 'new'}-resource-form`));
    const res = await postFormData(url, formData, method);

    if (!res.ok) {
      const t = await res.text();
      error = JSON.parse(t);
      savingStatus.set('failed');
    } else {
      savingStatus.set('saved');
      resetFormDisplay();
      displaySavedBanner();

      /* Dispatch new/updated action to Collection's list */
      const updatedResource = await res.json();
      dispatch('updateCollection', {
        resource: updatedResource.data,
      });
    }
  }

  async function destroyResource() {
    savingStatus.set('saving');
    const path = ['users', userId, 'games', $game.data.id, 'resources', resource.id];
    const url = createUrl(apiProtocol, apiHost, ...path);
    const res = await postFormData(url, {}, 'DELETE');

    if (res.status !== 204) {
      const t = await res.text();
      error = JSON.parse(t);
      savingStatus.set('failed');
    } else {
      savingStatus.set('saved');
      error = null;

      /* Update resources list */
      dispatch('removeCollectionMember', {
        resource: {
          id: resource.id,
        },
      });
    }
  }

  /* Reload the original Resource Data if user hits the Cancel button */
  async function resetResource() {
    let path, method;
    path = ['users', userId, 'games', $game.data.id, 'resources', resource.id];

    const url = createUrl(apiProtocol, apiHost, ...path);
    const res = await fetchData(url);

    if (res.ok) {
      const updatedResource = await res.json();
      dispatch('updateCollection', {
        resource: updatedResource.data,
      });
    }
    resetFormDisplay();
  }

  /* When a user removes a namespace from the
   * default value entry */
  function createCustomEntry(assetIndex, namespace) {
    /* Remove from where it belongs */
    resource.attributes.assets = resource.attributes.assets.map((asset, index) => {
      return index !== assetIndex ? asset : {
        key: asset.key,
        tuples: asset.tuples.map((tuple) => ({
          namespaces: tuple.namespaces.filter((ns) => ns !== namespace),
          value: tuple.value,
        })),
      };
    });

    /* Add a new custom entry */
    resource.attributes.assets = resource.attributes.assets.map((asset, index) => {
      return index !== assetIndex ? asset : {
        key: asset.key,
        tuples: [
          ...asset.tuples,
          {
            namespaces: [namespace],
            value: '',
          }
        ],
      };
    });
  }

  /* When the user removes a namespace from
   * a custom entry */
  function removeCustomEntry(assetIndex, namespace) {
    /* Remove Custom Entry */
    resource.attributes.assets = resource.attributes.assets.map((asset, index) => {
      return index !== assetIndex ? asset : {
        key: asset.key,
        tuples: asset.tuples.filter((tuple) => !tuple.namespaces.includes(namespace)),
      }
    });

    /* Add namespace to default Entry */
    resource.attributes.assets[0].tuples[0].namespaces = [
      ...resource.attributes.assets[0].tuples[0].namespaces,
      namespace,
    ]
  }

  function removeAsset(assetIndex) {
    resource.attributes.assets = resource.attributes.assets.filter((asset, index) => index !== assetIndex);
  }

  function addNewAsset() {
    resource.attributes.assets = [
      ...resource.attributes.assets,
      {
        key: '',
        tuples: [
          {
            namespaces: $game.data.attributes.namespaces,
            value: '',
          },
        ],
      },
    ]
  }

  function sourcePrettify(val) {
    let result = 'Unknown';

    switch(val) {
      case 'virtual':
        result = 'Virtual money';
        break;
      case 'list':
        result = 'CSV List';
        break;
      case 'uri':
        result = 'External URI';
        break;
      case 'scheme':
        result = 'Scheme';
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
</script>


<div class='item-box'>

  <!-- Show Resource -->
  <div class:is-hidden={displayEditForm || !resource.id}>
    <div class="columns is-mobile">
      <div class="column">
        <h1 class="title is-4 has-vcentered-text item-name">
          <svg class="twemoji">
            <use href="../images/twemoji-sprite.svg#white_medium_star" />
          </svg>
          <span class:is-hidden={displayEditForm}>
            {resource.attributes.name}
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
            Source Type :
          </td>
          <td class="is-value">
            {sourcePrettify(resource.attributes.source)}
          </td>
        </tr>
      </tbody>
    </table>

    {#if resource.attributes.assets.length}
      <h1 class="title is-5 byproduct-title">
        <svg class="chevron" on:click={() => toggleSection('assets', true)}
          class:is-hidden={isExpandedSection.assets}>
          <use href="../images/fontawesome-sprite.svg#solid-chevron-double-right" />
        </svg>
        <svg class="chevron" on:click={() => toggleSection('assets', false)}
          class:is-hidden={!isExpandedSection.assets}>
          <use href="../images/fontawesome-sprite.svg#solid-chevron-double-down" />
        </svg>
        <svg class="twemoji">
          <use href="../images/twemoji-sprite.svg#package" />
        </svg>
        Assets <span class="quantity">({resource.attributes.assets.length})</span>
      </h1>

      <div class:is-hidden={!isExpandedSection.assets}>
        {#each resource.attributes.assets as {key, tuples}}
          <div class="asset-wrapper">
            <div class="columns is-vcentered">
              <div class="column is-4 right">
                <strong>key :</strong>
              </div>
              <div class="column asset-value is-family-monospace">
                {key}
              </div>
            </div>
            <div class="columns">
              <div class="column is-4 right">
                <strong>values :</strong>
              </div>
            </div>
            {#each tuples as { namespaces, value }}
              <div class="columns is-vcentered">
                <div class="column is-4 right namespace-container">
                  {#if namespaces.includes('default')}
                    <p>
                      <span class="tag is-link">
                        default
                      </span>
                    </p>
                    {#if namespaces.length > 1}
                      <p>
                        <span class="tag is-link">
                          + {namespaces.length - 1} 
                          {(namespaces.length - 1) === 1 ? 'other' : 'others'} 
                        </span>
                      </p>
                    {/if}
                  {:else}
                    {#each namespaces as namespace}
                      <p>
                        <span class="tag is-link">
                          {namespace}
                        </span>
                      </p>
                    {/each}
                  {/if}
                </div>
                <div class="column asset-value is-family-monospace">
                  {value}
                </div>
              </div>
            {/each}
          </div>
        {/each}
      </div>
    {/if}


    <p class="help">
      Need help? See 
      <a href="https://doc/place2be.io/resources" target="_blank">
        <span>Doc</span>
        <svg class="fa fill-primary no-hover">
          <use href="../images/fontawesome-sprite.svg#regular-external-link-square" />
        </svg>
      </a>
    </p>
  </div>









  <!-- Edit Resource -->
  <div class:is-hidden={!displayEditForm && resource.id}>
    <form id="{resource.id || 'new'}-resource-form"
      on:submit|preventDefault={saveResource}>

      <div class="notification is-danger" class:is-hidden={!error} >
        <button class="delete" on:click|preventDefault={() => flushError()} ></button>
        <h1 class='title is-5'>
          Unable to Update Resource :
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
        Properties
      </h1>

      <div class="field is-horizontal">
        <div class="field-label is-normal">
          <label class="label">Name :</label>
        </div>
        <div class="field-body">
          <div class="field">
            <input class="input reasonable-width" type="text" name="resource[name]"
              bind:value={resource.attributes.name} placeholder="Resource name">
          </div>
        </div>
      </div>

      <div class="field is-horizontal">
        <div class="field-label is-normal">
          <label class="label">Source Type :</label>
        </div>
        <div class="field-body">
          <div class="select">
            <select name="resource[source]" bind:value={resource.attributes.source}>
              <option value='virtual'>Virtual money</option>
              <option value='list' disabled='disabled'>CSV List</option>
              <option value='uri' disabled='disabled'>External URI</option>
              <option value='scheme' disabled='disabled'>Scheme</option>
            </select>
          </div>
        </div>
      </div>


      <h1 class="title is-5 byproduct-title">
        <svg class="twemoji">
          <use href="../images/twemoji-sprite.svg#package" />
        </svg>
        Assets
        <span class="note">(optional)</span>
      </h1>
      <div class="content">
        <ul class="help">
          <li>
            Assets are key-value entries you can associate with a Resource.
          </li>
          <li>
            Everytime a Resource will be involved, its associated assets will be returned as well.
          </li>
          <li>
            You can have multiple assets per Resource, carrying any information you want.
          </li>
          <li>
            See assets
            <a href="https://doc/place2be.io/assets" target="_blank">
              <span>Doc</span>
              <svg class="fa fill-primary no-hover">
                <use href="../images/fontawesome-sprite.svg#regular-external-link-square" />
              </svg>
            </a>
            for common use cases and examples.
          </li>
        </ul>
      </div>

      <!-- Dummy value when no assets submitted -->
      <input class="input" type="hidden" name="resource[assets][0][key]" value="">

      {#each resource.attributes.assets as {key, tuples}, assetIndex}
        <div class="asset-wrapper">
          <div class="columns">
            <div class="column right">
              <svg class="fa fill-destroy" on:click={() => removeAsset(assetIndex)}>
                <use href="../images/fontawesome-sprite.svg#regular-times-circle" />
              </svg>
            </div>
          </div>
          <div class="columns is-vcentered">
            <div class="column is-4 right-label">
              <strong>key :</strong>
            </div>
            <div class="column asset-value">
              <input class="input is-family-monospace" type="text"
                name="resource[assets][{assetIndex}][key]"
                bind:value={key} placeholder="asset key">
            </div>
          </div>
          <div class="columns">
            <div class="column is-4 right-label">
              <strong>values :</strong>
            </div>
          </div>
          {#each tuples as { namespaces, value }, tupleIndex}
            <div class="columns is-vcentered">
              <div class="column is-4 right-label namespace-container">
                {#each namespaces as namespace}
                  <p>
                    <span class="tag is-link">
                      {namespace}
                      <input class="input" type="hidden"
                        name="resource[assets][{assetIndex}][tuples][{tupleIndex}][namespaces][]"
                        value={namespace}>
                      {#if namespace !== 'default'}
                        {#if namespaces.includes('default')}
                          <button class="delete is-small"
                            on:click|preventDefault={createCustomEntry(assetIndex, namespace)}>
                          </button>
                        {:else}
                          <button class="delete is-small"
                            on:click|preventDefault={removeCustomEntry(assetIndex, namespace)}>
                          </button>
                        {/if}
                      {/if}
                    </span>
                  </p>
                {/each}
              </div>
              <div class="column asset-value is-family-monospace">
                <textarea class="input is-family-monospace"
                  name="resource[assets][{assetIndex}][tuples][{tupleIndex}][value]"
                  bind:value={value} placeholder="asset value" />
              </div>
            </div>
          {/each}
        </div>
      {/each}

      <div class="columns">
        <div class="column right-label">
          <button class="button is-primary is-outlined is-small"
            on:click|preventDefault={() => addNewAsset()}>
            + New Asset
          </button>
        </div>
      </div>


      <div class="columns is-vcentered">
        <div class="column is-narrow">
          <p class="help">
            Need help? See 
            <a href="https://doc/place2be.io/resources" target="_blank">
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
            {#if !resource.id}
              Create
            {:else}
              Update
            {/if}
            </button>
            {#if resource.id}
              <button class="button is-primary is-light"
                on:click|preventDefault={resetResource}>
                Cancel
              </button>
              <button class="button is-danger"
                on:click|preventDefault={destroyResource}>
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
  .asset-wrapper {
    border-radius: 0.15em;
    background-color: #f6f8fa;
    margin-bottom: 1em;
    margin-top: 1em;
    padding: 0.5em;
    border: 1px solid #0096df;

    .columns {
      margin-bottom: 0;
    }
  }
  .right {
    text-align: right;
  }
  .right-label {
    /* Desktop */
    @media screen and (min-width: 768px) {
      text-align: right;
    }
  }
  .is-value {
    color: gray;
    font-style: italic;
    word-break: break-all;
  }
  .namespace-container {
    /* Mobile */
    @media screen and (max-width: 768px) {
      padding-bottom: 0.2em;
      display: inline-flex;
    }
    p {
      margin-right: 0.5em;
    }
  }
  .asset-value {
    color: gray;
    word-break: break-all;

    /* Mobile */
    @media screen and (max-width: 768px) {
      padding-top: 0;
      margin-bottom: 1em;
    }
  }
  button.is-danger {
    color: #cb2431 !important;
    background: white !important;
    border: 1px solid #cb2431 !important;
  }
</style>