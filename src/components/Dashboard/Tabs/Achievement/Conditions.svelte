<script>
  import ActionTriggerShow from './ConditionsShows/ActionTrigger.svelte';
  import ActionTriggerForm from './ConditionsForms/ActionTrigger.svelte';
  import UnlockedAchievementShow from './ConditionsShows/UnlockedAchievement.svelte';
  import UnlockedAchievementForm from './ConditionsForms/UnlockedAchievement.svelte';
  import { game } from '../../../../javascripts/stores/gameStore';
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  export let formPrefix;
  export let conditions;
  let newConditionType;

  const conditionsShowsComponents = {
    action_trigger: ActionTriggerShow,
    unlocked_achievement: UnlockedAchievementShow,
  };
  const conditionsFormsComponents = {
    action_trigger: ActionTriggerForm,
    unlocked_achievement: UnlockedAchievementForm,
  }

  function addCondition(evt){
    dispatch('updateConditions', {
      conditions: [...conditions, evt.detail.condition],
    });
    newConditionType = "";
  }
</script>


<div>
  <hr>
  {#if !conditions.length}
    <p class="no-conditions">
      No conditions yet
    </p>
  {:else}
    <ul class="conditions-list">
      {#each conditions as condition, i (i)}
        <li>
          <svelte:component
            {condition}
            formPrefix={`${formPrefix}[${i}]`}
            underlyings={$game.included}
            this={conditionsShowsComponents[condition.attributes.conditionType]}
            on:message/>
        </li>
      {/each}
    </ul>
  {/if}
  <hr>
</div>

<div class="new-condition-container">
  <div class="columns">
    <div class="column is-narrow-desktop has-vcentered-content">
      New Condition :
    </div>
    <div class="column is-narrow-desktop">
      <div class="select is-link">
        <select bind:value={newConditionType}>
          <option value="">--</option>
          <option value="action_trigger">Action trigger</option>
          <option value="unlocked_achievement">Unlocked Achievement</option>
          <option value="time_frame">Time frame</option>
          <option value="scarcity" disabled>Scarcity</option>
          <option value="lottery" disabled>Lottery</option>
          <option value="subcondition" disabled>Sub Condition Set</option>
        </select>
      </div>
    </div>
  </div>


  <svelte:component
    underlyings={$game.included}
    this={conditionsFormsComponents[newConditionType]}
    on:addCondition={addCondition}/>
</div>



<style lang="scss">
  .no-conditions {
    font-style: italic;
    color: gray;
    margin: 1em 1em 1em 0.5em; /* top right bottom left */
  }
  .new-condition-container {
    background-color: #f6f8fa;
    padding: 1em;
  }
  .conditions-list {
    li {
      margin-bottom: 2em;
    }
  }
</style>