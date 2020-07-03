<script>
  import { capitalizeFirstLetter } from '../../../../../../javascripts/utils/helpers';
  export let formPrefix;
  export let condition;
  export let underlyings;
  let underlying;

  function destroyCondition() {
    condition.attributes._destroy = true;
  }

  $: underlying = underlyings.find((u) => 
    u.id === condition.relationships.underlying.data.id &&
    u.type === condition.relationships.underlying.data.type
  );
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
      Unlocked <strong>'{underlying.attributes.name}'</strong>
    </div>
    {#if formPrefix}
      <div class="column is-narrow">
        <svg class="fa fill-destroy" on:click={destroyCondition}>
          <use href="../images/fontawesome-sprite.svg#regular-times-circle" />
        </svg>
      </div>

      <input type="hidden" name="{formPrefix}[inverted]"
        value="{condition.attributes.inverted}">

      <input type="hidden" name="{formPrefix}[underlying_type]"
        value="{capitalizeFirstLetter(condition.relationships.underlying.data.type)}">

      <input type="hidden" name="{formPrefix}[underlying_id]"
        value="{condition.relationships.underlying.data.id}">

      <input type="hidden" name="{formPrefix}[condition_type]" value="unlocked_achievement">

      {#if condition.attributes._destroy}
        <input type="hidden" name="{formPrefix}[_destroy]" value="true">
      {/if}
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