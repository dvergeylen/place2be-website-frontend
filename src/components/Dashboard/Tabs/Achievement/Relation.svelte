<script>
  import Conditions from './Conditions.svelte';
  import { fetchData } from '../../../../javascripts/utils/helpers';
  import { game } from '../../../../javascripts/stores/gameStore';
  export let relation = {
    data: {
      attributes: {
        count: 1,
      },
    },
    included: [],
  };
  export let formPrefix;
  let error = null;

  function updateConditions(evt) {
    relation.included = evt.detail.conditions;
  }
</script>

<fieldset class="fieldset">
  <legend>Condition Set</legend>
  <input type="hidden" name="{formPrefix}[game_id]"
    value="{$game.data.id}">

  <div class="field">
    <label class="label">
      Type
    </label>
    <!-- Desktop -->
    <div class="select is-hidden-desktop">
      <select name="{formPrefix}[relation_type]"
        bind:value={relation.data.attributes.relationType}>
        <option value='binomial'>Binomial</option>
        <option value='xor'>eXclusive OR</option>
      </select>
    </div>

    <!-- Mobile -->
    <div class="select is-hidden-touch">
      <select name="{formPrefix}[relation_type]"
        bind:value={relation.data.attributes.relationType}>
        <option value='binomial'>Binomial (meet at least X among Y cond.)</option>
        <option value='xor'>eXclusive OR (meet exactly 1 among Y cond.)</option>
      </select>
    </div>

  </div>
  <div class="field">
    <div class="columns is-variable is-1 compact-mobile"
      class:is-hidden={relation.data.attributes.relationType == 'xor'}>
      <div class="column is-narrow-desktop is-gapless-desktop has-vcentered-text">
        Player must validate 
      </div>
      <div class="column is-narrow-desktop has-vcentered-text">
        <em>minimum</em>
        <input type="text" class="input count"
          name="{formPrefix}[count]" bind:value={relation.data.attributes.count}>
        {relation.data.attributes.count === 1 ? 'condition' : 'conditions'}
      </div>
      <div class="column is-narrow-desktop has-vcentered-text">
         among the following ↴ :
      </div>
    </div>

    <div class="columns is-variable is-1 compact-mobile"
      class:is-hidden={relation.data.attributes.relationType == 'binomial'}>
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
    conditions={relation.included.filter((e) => e.type === 'condition')}
    formPrefix={`${formPrefix}[conditions_attributes]`}
    on:updateConditions={updateConditions}/>

</fieldset>

<style lang="scss">
  div.compact-mobile {
    /* Mobile */
    @media screen and (max-width: 768px) {
      margin-top: 1em;

      div.column {
        padding: 0;
      }
    }
  }
</style>