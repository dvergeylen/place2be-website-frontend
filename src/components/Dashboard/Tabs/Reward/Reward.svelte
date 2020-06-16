<script>
  import { getContext, createEventDispatcher } from 'svelte';
  import { createUrl } from '../../../../javascripts/utils/helpers';
  import { postFormData } from '../../../../javascripts/utils/helpers';
  import { game } from '../../../../javascripts/stores/gameStore';
  import { savingStatus } from '../../../../javascripts/stores/savingStore';
  export let reward = {
    attributes: {
      name: '',
      source: 'virtual',
      assets: [
        {
          key: '',
          tuples: [
            {
              namespaces: $game['attributes']['namespaces'],
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

  async function saveReward() {
    savingStatus.set('saving');
    let path, method;

    if (reward.id) {
      path = ['users', userId, 'games', $game.id, 'rewards', reward.id];
      method = 'PUT';
    } else {
      path = ['users', userId, 'games', $game.id, 'rewards'];
      method = 'POST';
    }
    const url = createUrl(apiProtocol, apiHost, ...path);
    const formData = new FormData(document.getElementById(`${reward.id || 'new'}-reward-form`));
    const res = await postFormData(url, formData, method);

    if (!res.ok) {
      const t = await res.text();
      error = JSON.parse(t);
      savingStatus.set('failed');
    } else {
      /* Update reward (update) or Update rewards list (new) */
      savingStatus.set('saved');
      if (reward.id) {
        const updatedReward = await res.json();
        reward = updatedReward.data;
        resetFormDisplay();
      } else {
        const rewards = await res.json();
        dispatch('message', {
          rewards: rewards.data,
        });
      }
    }
  }

  async function destroyReward() {
    savingStatus.set('saving');
    const path = ['users', userId, 'games', $game.id, 'rewards', reward.id];
    const url = createUrl(apiProtocol, apiHost, ...path);
    const res = await postFormData(url, {}, 'DELETE');

    if (!res.ok) {
      const t = await res.text();
      error = JSON.parse(t);
      savingStatus.set('failed');
    } else {
      savingStatus.set('saved');

      /* Update rewards list */
      const rewards = await res.json();
      dispatch('message', {
        rewards: rewards.data,
      });
    }
  }

  /* When a user removes a namespace from the
   * default value entry */
  function createCustomEntry(assetIndex, namespace) {
    /* Remove from where it belongs */
    reward.attributes.assets = reward.attributes.assets.map((asset, index) => {
      return index !== assetIndex ? asset : {
        key: asset.key,
        tuples: asset.tuples.map((tuple) => ({
          namespaces: tuple.namespaces.filter((ns) => ns !== namespace),
          value: tuple.value,
        })),
      };
    });

    /* Add a new custom entry */
    reward.attributes.assets = reward.attributes.assets.map((asset, index) => {
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
    reward.attributes.assets = reward.attributes.assets.map((asset, index) => {
      return index !== assetIndex ? asset : {
        key: asset.key,
        tuples: asset.tuples.filter((tuple) => !tuple.namespaces.includes(namespace)),
      }
    });

    /* Add namespace to default Entry */
    reward.attributes.assets[0].tuples[0].namespaces = [
      ...reward.attributes.assets[0].tuples[0].namespaces,
      namespace,
    ]
  }

  function removeAsset(assetIndex) {
    reward.attributes.assets = reward.attributes.assets.filter((asset, index) => index !== assetIndex);
  }

  function addNewAsset() {
    reward.attributes.assets = [
      ...reward.attributes.assets,
      {
        key: '',
        tuples: [
          {
            namespaces: $game['attributes']['namespaces'],
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

  function flushError() {
    error = null;
  }
</script>


<div class='item-box'>

  <!-- Show Reward -->
  <div class:is-hidden={displayEditForm || !reward.id}>
    <div class="columns is-mobile">
      <div class="column">
        <h1 id="reward-name" class="title is-5 has-vcentered-text">
          <span class:is-hidden={displayEditForm}>
            {reward.attributes.name}
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
            Source Type :
          </td>
          <td class="is-value">
            {sourcePrettify(reward.attributes.source)}
          </td>
        </tr>
      </tbody>
    </table>

    {#if reward.attributes.assets.length}
      <h1 class="title is-6">
        Assets :
      </h1>
    {/if}

    {#each reward.attributes.assets as {key, tuples}}
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


    <p class="help">
      Need help? See 
      <a href="https://doc/place2be.io/rewards" target="_blank">
        <span>Doc</span>
        <svg class="fa fill-primary no-hover">
          <use href="../images/fontawesome-sprite.svg#regular-external-link-square" />
        </svg>
      </a>
    </p>
  </div>









<!-- FORM REWARD -->
  <div class:is-hidden={!displayEditForm && reward.id}>
    <form id="{reward.id || 'new'}-reward-form"
      on:submit|preventDefault={saveReward}>

      <div class="columns is-mobile">
        <div class="column">
          <h1 id="reward-name" class="title is-5 has-vcentered-text">
            <input class="input reasonable-width" type="text" name="reward[name]"
              bind:value={reward.attributes.name} placeholder="Reward name">
          </h1>
        </div>

        {#if reward.id}
          <div class="column is-narrow">
              <svg class="fa destroy" on:click={destroyReward}>
                <use href="../images/fontawesome-sprite.svg#regular-times-circle" />
              </svg>
          </div>
        {/if}
      </div>

      <div class="notification is-danger" class:is-hidden={!error} >
        <button class="delete" on:click|preventDefault={() => flushError()} ></button>
        <h1 class='title is-5'>
          Unable to Update Reward :
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
          <tr class="has-vcentered-content">
            <td class="right">
              Source Type :
            </td>
            <td class="is-value">
              <div class="select">
                <select name="reward[source]" bind:value={reward.attributes.source}>
                  <option value='virtual'>Virtual money</option>
                  <option value='list' disabled='disabled'>CSV List</option>
                  <option value='uri' disabled='disabled'>External URI</option>
                  <option value='scheme' disabled='disabled'>Scheme</option>
                </select>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <h1 class="title is-6">
        Assets :
      </h1>
      <p class="help">
        Assets are key-value entries you can associate with a Reward.
        Everytime a Reward will be involved, its associated assets will be returned as well.
        You can have multiple assets per Reward, carrying any information you want.
        <br />
        See assets
          <a href="https://doc/place2be.io/assets" target="_blank">
            <span>Doc</span>
            <svg class="fa fill-primary no-hover">
              <use href="../images/fontawesome-sprite.svg#regular-external-link-square" />
            </svg>
          </a>
        for common use cases and examples.
      </p>

      <!-- Dummy value when no assets submitted -->
      <input class="input" type="hidden" name="reward[assets][0][key]" value="">

      {#each reward.attributes.assets as {key, tuples}, assetIndex}
        <div class="asset-wrapper">
          <div class="columns is-vcentered">
            <div class="column is-4 right">
              <strong>key :</strong>
            </div>
            <div class="column asset-value">
              <input class="input is-family-monospace" type="text"
                name="reward[assets][{assetIndex}][key]"
                bind:value={key} placeholder="asset key">
            </div>
          </div>
          <div class="columns">
            <div class="column is-4 right">
              <strong>values :</strong>
            </div>
          </div>
          {#each tuples as { namespaces, value }, tupleIndex}
            <div class="columns is-vcentered">
              <div class="column is-4 right namespace-container">
                {#each namespaces as namespace}
                  <p>
                    <span class="tag is-link">
                      {namespace}
                      <input class="input" type="hidden"
                        name="reward[assets][{assetIndex}][tuples][{tupleIndex}][namespaces][]"
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
                  name="reward[assets][{assetIndex}][tuples][{tupleIndex}][value]"
                  bind:value={value} placeholder="asset value" />
              </div>
            </div>
          {/each}
          <div class="columns is-vcentered">
            <div class="column has-vcentered-content is-value">
              <p class="help">
                <a href="javascript:void(0)" on:click={() => removeAsset(assetIndex)}>
                  Remove
                </a>
              </p>
            </div>
          </div>
        </div>
      {/each}

      <div class="columns">
        <div class="column right">
          <button class="button is-primary is-outlined is-small"
            on:click|preventDefault={() => addNewAsset()}>
            + New Asset
          </button>
        </div>
      </div>

      <table class="table">
        <tbody>
          <tr class="has-vcentered-content">
            <td>
              <p class="help">
                Need help? See 
                <a href="https://doc/place2be.io/rewards" target="_blank">
                  <span>Doc</span>
                  <svg class="fa fill-primary no-hover">
                    <use href="../images/fontawesome-sprite.svg#regular-external-link-square" />
                  </svg>
                </a>
              </p>
            </td>
            <td>
                <button class="button is-primary">
                {#if !reward.id}
                  Create
                {:else}
                  Update
                {/if}
                </button>
                {#if reward.id}
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
  #reward-name {
    margin-top: 0.5em;
    margin-left: 0.5em;
  }

  .asset-wrapper {
    border-radius: 0.2em;
    background-color: #f6f8fa;
    margin-bottom: 1em;
    margin-top: 1em;
    padding: 0.5em;
    .columns {
      margin-bottom: 0;
    }
  }

  .right {
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
  .name-edit {
    height: 0.7em;
    margin-left: 0.2em;
  }
  .fa {
    cursor: pointer;
  }

</style>