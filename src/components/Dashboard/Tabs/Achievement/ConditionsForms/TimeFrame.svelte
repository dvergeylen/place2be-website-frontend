<script>
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();
  export const underlyings = []; // not used
  let inverted = false;
  let from;
  let to;
  let validDates = false;

  function addCondition() {
    /* Gather form */
    const newCondition = {
      type: 'condition',
      attributes: {
        conditionType: 'time_frame',
        inverted,
        criteria: {
          from,
          to,
        },
      },
    };

    /* Dispatch to Conditions Component */
    dispatch('addCondition', {
      condition: newCondition,
    });
  }

  $: validDates = !isNaN(new Date(from)) &&
                  !isNaN(new Date(to))   &&
                  (from <= to);
</script>

<div class="columns">
  <div class="column">
    <div class="field is-horizontal">
      <div class="field-label is-normal">
        <label class="label">From : </label>
      </div>
      <div class="field-body">
        <div class="field">
          <input type="date" class="input date-width" bind:value={from}>
        </div>
      </div>
    </div>


    <div class="field is-horizontal">
      <div class="field-label is-normal">
        <label class="label">To : </label>
      </div>
      <div class="field-body">
        <div class="field">
          <input type="date" class="input date-width" bind:value={to}>
        </div>
      </div>
    </div>

    <div class="field is-horizontal">
      <div class="field-label is-normal">
        <label class="label">Inverted ?</label>
      </div>
      <div class="field-body">
        <div class="field">
          <label class="checkbox">
            <p class="help">
              <input type="checkbox" bind:checked={inverted} />
              Must be OUT of the time frame to be valid 🙃
            </p>
          </label>
        </div>
      </div>
    </div>


    <div class="columns">
      <div class="column">
        <button class="button is-primary is-outlined"
          on:click|preventDefault={addCondition} disabled={!validDates}>
          Add
        </button>
      </div>
    </div>
  </div>
</div>