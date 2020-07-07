<script>
  import Conditions from './Conditions.svelte';
  import { fetchData } from '../../../../../javascripts/utils/helpers';
  import { game } from '../../../../../javascripts/stores/gameStore';
  export let relation = {
    attributes: {
      count: 1,
    },
  };
  export let conditions;
  export let formPrefix;
  let error = null;

  function updateConditions(evt) {
    conditions = evt.detail.conditions;
  }

  function filterConditions(relation, game) {
    if (!relation.relationships)
      return [];

    const conditionIds = relation.relationships.conditions.data.map((c) => c.id);

    return game.included.filter((e) => (
      conditionIds.includes(e.id) && e.type === 'condition'
    ));
  }

  $: conditions = filterConditions(relation, $game);
</script>

<div class="relation-wrapper">
  {#if formPrefix}
    <input type="hidden" name="{formPrefix}[game_id]"
      value="{$game.data.id}">

    <div class="field">
      <label class="label">
        Type
      </label>
      <!-- Desktop -->
      <div class="select is-hidden-desktop">
        <select name="{formPrefix}[relation_type]"
          bind:value={relation.attributes.relationType}>
          <option value='binomial'>Binomial</option>
          <option value='xor'>eXclusive OR</option>
        </select>
      </div>

      <!-- Mobile -->
      <div class="select is-hidden-touch">
        <select name="{formPrefix}[relation_type]"
          bind:value={relation.attributes.relationType}>
          <option value='binomial'>Binomial (meet at least X among Y cond.)</option>
          <option value='xor'>eXclusive OR (meet exactly 1 among Y cond.)</option>
        </select>
      </div>
    </div>
  {/if}

  <div class="field">
    <div class="columns is-variable is-1 compact-mobile"
      class:is-hidden={relation.attributes.relationType == 'xor'}>
      <div class="column is-narrow-desktop is-gapless-desktop has-vcentered-text">
        Player must validate 
      </div>
      <div class="column is-narrow-desktop has-vcentered-text">
        <em>minimum</em>
        <input type="text" class="input count"
          name="{formPrefix}[count]" bind:value={relation.attributes.count}
          disabled={formPrefix === undefined}>
        {relation.attributes.count === 1 ? 'condition' : 'conditions'}
      </div>
      <div class="column is-narrow-desktop has-vcentered-text">
         among the following ↴ :
      </div>
    </div>

    <div class="columns is-variable is-1 compact-mobile"
      class:is-hidden={relation.attributes.relationType == 'binomial'}>
      <div class="column is-narrow-desktop is-gapless-desktop has-vcentered-text">
        Player must validate 
      </div>
      <div class="column is-narrow-desktop has-vcentered-text">
        <em>exactly</em>
        <input type="text" class="input count"
      value="1" disabled="true">
        condition
      </div>
      <div class="column is-narrow-desktop has-vcentered-text">
         among the following ↴ :
      </div>
    </div>
  </div>

  <Conditions
    {conditions}
    formPrefix={ formPrefix ? `${formPrefix}[conditions_attributes]` : undefined}
    on:updateConditions={updateConditions}/>

</div>

<style lang="scss">
  div.relation-wrapper {
    max-width: 96%;
    margin-left: auto;
    margin-right: auto;
  }
  div.compact-mobile {
    /* Mobile */
    @media screen and (max-width: 768px) {
      margin-top: 1em;

      div.column {
        padding: 0.15em;
      }
    }
  }
</style>