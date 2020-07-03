<script>
  export let assets;
</script>

{#each assets as {key, tuples}}
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

<style lang="scss">
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