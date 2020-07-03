<script>
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();
  export let underlyings;
  let achievements;
  let achievement;
  let underlyingId = null;
  let inverted = false;
  const underlyingType = 'Achievement';

  function addCondition() {
    /* Gather form */
    const newCondition = {
      type: 'condition',
      relationships: {
        underlying: {
          data: {
            id: underlyingId,
            type: 'achievement',
          }
        }
      },
      attributes: {
        conditionType: 'unlocked_achievement',
        inverted,
      }
    };

    /* Dispatch to Conditions Component */
    dispatch('addCondition', {
      condition: newCondition,
    });
  }

  $: achievements= underlyings.filter((e) => e.type === 'achievement');
  $: achievement = achievements.find((a) => a.id === underlyingId);
</script>

<div class="columns">
  <div class="column">
    <div class="field is-horizontal">
      <div class="field-label"
        class:has-hvcentered-content={!achievements.length}
        class:is-normal={achievements.length}>
        <label class="label">Achievement :</label>
      </div>
      <div class="field-body">
        <div class="field">
          {#if achievements.length}
            <div class="select">
              <select bind:value={underlyingId}>
                <option value="">--</option>
                {#each achievements as achievement, i (i)}
                  <option value="{achievement.id}">{achievement.attributes.name}</option>
                {/each}
              </select>
            </div>
          {:else}
            <p class="no-achievements">No Achievement defined in the Achievement tab yet.</p>
          {/if}
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
              The achievement MUST NOT be unlocked 🙃
            </p>
          </label>
        </div>
      </div>
    </div>

    {#if achievements.length}
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
  .no-achievements {
    font-style: italic;
    color: gray;
    margin: 1em 1em 1em 0.5em; /* top right bottom left */

    /* Mobile */
    @media screen and (max-width: 768px) {
      text-align: center;
    }
  }
</style>