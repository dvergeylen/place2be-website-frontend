<script>
  import { capitalizeFirstLetter } from '../../../../../javascripts/utils/helpers';
  export let formPrefix;
  export let condition;
  export const underlyings = []; // not used

  function destroyCondition() {
    condition.attributes._destroy = true;
  }
</script>

<div class="content" class:is-hidden={condition.attributes._destroy}>
  <div class="columns is-mobile">
    <div class="column">
      <svg class="fa check">
        <use href="../images/fontawesome-sprite.svg#regular-check-circle" />
      </svg>
      {#if condition.attributes.inverted}
        <span class="not">NOT</span>
      {/if}
      Between <strong>{condition.attributes.criteria.from}</strong> and
      <strong>{condition.attributes.criteria.to}</strong> (both included)
    </div>
    <div class="column is-narrow">
      <svg class="fa fill-destroy" on:click={destroyCondition}>
        <use href="../images/fontawesome-sprite.svg#regular-times-circle" />
      </svg>
    </div>

    <input type="hidden" name="{formPrefix}[inverted]"
      value="{condition.attributes.inverted}">

    <input type="hidden" name="{formPrefix}[criteria][from]"
    value="{(new Date(condition.attributes.criteria.from)).toLocaleDateString()}">

    <input type="hidden" name="{formPrefix}[criteria][to]"
    value="{(new Date(condition.attributes.criteria.to)).toLocaleDateString()}}">

    <input type="hidden" name="{formPrefix}[condition_type]" value="time_frame">

    {#if condition.attributes._destroy}
      <input type="hidden" name="{formPrefix}[_destroy]" value="true">
    {/if}
  </div>
</div>

<style lang="scss">
  .check {
    fill: #0096df;
  }
  .not {
    color: #c40000;
  }
</style>