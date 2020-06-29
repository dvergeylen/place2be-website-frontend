<script>
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();
  export let actions;
  let action;
  let count = 1;
  let period = 0;
  let underlyingId = null;
  const underlyingType = 'Action';
  const attribute = 'score';
  let value;
  let comparison;
  let inverted = false;
  let error = null;

  const periodEnum = {
    0: 'past year',
    1: 'past 90 days',
    2: 'past 30 days',
    3: 'past 7 days',
    4: 'past 5 days',
    5: 'past 3 days',
    6: 'past 2 days',
    7: 'past 24 hours',
  };

  function addCondition() {
    error = null;
    const scoreValidation = value;

    if (isNaN(parseInt(count))) {
      error = {
        ...error,
        'trigger count': `Trigger count must be a number, not "${count}"`,
      };
    }
    if (action.attributes.actionType === 'int' ||
        action.attributes.actionType === 'float') {
      if(isNaN(parseInt(value))) {
        error = {
          ...error,
          attribute: `Score value must be a number because \
  ${action.attributes.name}'s Scoretype is ${action.attributes.actionType}`,
        };
      }
    } else if (action.attributes.actionType === 'string') {
      if (!value || !Array.isArray(value.split(','))) {
        error = {
          ...error,
          attribute: `Score value must be a comma separated list of
accepted values because ${action.attributes.name}'s Scoretype \
is ${action.attributes.actionType}`,
        };
      }
    }
    
    if (error) return;

    /* Gather form */
    const newCondition = {
      type: 'condition',
      relationships: {
        underlying: {
          data: {
            id: underlyingId,
            type: 'action',
          }
        }
      },
      attributes: {
        conditionType: 'action_trigger',
        inverted,
        criteria: {
          count,
          period,
          validations: [{
            attribute,
            comparison,
            value,
          }],
        }
      }
    };

    /* Dispatch to Conditions Component */
    dispatch('addCondition', {
      condition: newCondition,
    });
  }

  function flushError() {
    error = null;
  }

  $: action = actions.find((a) => a.id === underlyingId);
</script>


<div class="columns">
  <div class="column">
    <div class="field is-horizontal">
      <div class="field-label is-normal">
        <label class="label">Action :</label>
      </div>
      <div class="field-body">
        <div class="field">
          {#if actions.length}
            <div class="select">
              <select bind:value={underlyingId}>
                <option value="">--</option>
                {#each actions as action, i (i)}
                  <option value="{action.id}">{action.attributes.name}</option>
                {/each}
              </select>
            </div>
          {:else}
            <p class="no-actions">No Action defined in the Action tab yet.</p>
          {/if}
        </div>
      </div>
    </div>

    {#if actions.length}
      
      <div class="notification is-warning" class:is-hidden={!error} >
        <button class="delete" on:click|preventDefault={() => flushError()} ></button>
        <h1 class='title is-5'>
          Unable to add Condition :
        </h1>
        <ul>
          {#if error}
            {#each Object.entries(error) as [ key, ar ]}
              <li>{key} : {ar}</li>
            {/each}
          {/if}
        </ul>
      </div>


      <div class="field is-horizontal">
        <div class="field-label is-normal">
          <label class="label">Triggered :</label>
        </div>
        <div class="field-body">
          <div class="field">
            <p class="has-vcentered-content">
              minimum <input class="input count" type="text" bind:value={count}>
              <strong>{parseInt(count) === 1 ? 'time' : 'times'}</strong>
            </p>
          </div>
        </div>
      </div>


      <div class="field is-horizontal">
        <div class="field-label is-normal">
          <label class="label">Over the :</label>
        </div>
        <div class="field-body">
          <div class="field">
            <div class="select">
              <select bind:value={period}>
                {#each Object.entries(periodEnum) as [k, v], i (i)}
                  <option value="{k}">{v}</option>
                {/each}
              </select>
            </div>
          </div>
        </div>
      </div>

      {#if underlyingId}
        <div class="field is-horizontal">
          <div class="field-label is-normal">
            <label class="label">Score :</label>
          </div>
          <div class="field-body">
              <div class="field">
                <p class="control">
                  {#if action.attributes.actionType === 'boolean'}
                    <div class="select">
                      <select bind:value={comparison}>
                        <option value="eq">= equal to</option>
                      </select>
                    </div>
                  {:else if action.attributes.actionType === 'int' ||
                            action.attributes.actionType === 'float'}
                    <div class="select">
                      <select bind:value={comparison}>
                        <option value="gteq">≥ greater than or equal to</option>
                        <option value="lteq">≤ less than or equal to</option>
                        <option value="eq">= equal to</option>
                      </select>
                    </div>
                  {:else}
                    <!-- string's shortlist -->
                    <div class="select">
                      <select bind:value={comparison}>
                        <option value="shortlist">[↓] within</option>
                      </select>
                    </div>
                  {/if}
                </p>
              </div>
              <div class="field">
                <div class="control">
                  {#if action.attributes.actionType === 'boolean'}
                    <div class="select">
                      <select bind:value={value}>
                        <option value="1">Pass</option>
                        <option value="0">Fail</option>
                      </select>
                    </div>
                  {:else if action.attributes.actionType === 'int' ||
                            action.attributes.actionType === 'float' ||
                            action.attributes.actionType === 'string'}
                    <input type="text" class="input reasonable-width"
                      bind:value={value} required>
                  {:else if action.attributes.actionType === 'shortlist'}
                    <input type="text" class="input reasonable-width"
                      bind:value={value}
                      placeholder="comma separated list"
                      required>
                  {/if}
                </div>
              </div>
              <p class="help">Possible score values depend on selected Action's scoretype</p>
          </div>
        </div>
      {/if}

      <div class="field is-horizontal">
        <div class="field-label is-normal">
          <label class="label">Inverted? :</label>
        </div>
        <div class="field-body">
          <div class="field">
            <label class="checkbox">
              <p class="help">
                <input type="checkbox" bind:checked={inverted} />
                The condition MUST NOT be met to be validated 🙃
              </p>
            </label>
          </div>
        </div>
      </div>

      <div class="columns">
        <div class="column">
          <button class="button is-primary is-outlined"
            on:click|preventDefault={addCondition} disabled={!underlyingId}>
            Add
          </button>
        </div>
      </div>
    {/if}
  </div>
</div>

<style lang="scss">
  .no-actions {
    font-style: italic;
    color: gray;
    margin: 1em 1em 1em 0.5em; /* top right bottom left */
  }
</style>