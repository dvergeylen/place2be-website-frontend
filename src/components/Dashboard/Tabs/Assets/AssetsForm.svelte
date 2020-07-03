<script>
  import { game } from '../../../../javascripts/stores/gameStore';
  export let assets;
  export let formPrefix;


  function removeAsset(assetIndex) {
    assets = assets.filter((asset, index) => index !== assetIndex);
  }

  function addNewAsset() {
    assets = [
      ...assets,
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

  /* When a user removes a namespace from the
   * default value entry */
  function createCustomEntry(assetIndex, namespace) {
    /* Remove from where it belongs */
    assets = assets.map((asset, index) => {
      return index !== assetIndex ? asset : {
        key: asset.key,
        tuples: asset.tuples.map((tuple) => ({
          namespaces: tuple.namespaces.filter((ns) => ns !== namespace),
          value: tuple.value,
        })),
      };
    });

    /* Add a new custom entry */
    assets = assets.map((asset, index) => {
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
    assets = assets.map((asset, index) => {
      return index !== assetIndex ? asset : {
        key: asset.key,
        tuples: asset.tuples.filter((tuple) => !tuple.namespaces.includes(namespace)),
      }
    });

    /* Add namespace to default Entry */
    assets[0].tuples[0].namespaces = [
      ...assets[0].tuples[0].namespaces,
      namespace,
    ]
  }
</script>

<!-- Dummy value when no assets submitted -->
<input class="input" type="hidden" name="{formPrefix}[assets][0][key]" value="">

{#each assets as {key, tuples}, assetIndex}
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
          name="{formPrefix}[assets][{assetIndex}][key]"
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
                  name="{formPrefix}[assets][{assetIndex}][tuples][{tupleIndex}][namespaces][]"
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
            name="{formPrefix}[assets][{assetIndex}][tuples][{tupleIndex}][value]"
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


<style lang="scss">
  .right-label {
    /* Desktop */
    @media screen and (min-width: 768px) {
      text-align: right;
    }
  }
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
</style>