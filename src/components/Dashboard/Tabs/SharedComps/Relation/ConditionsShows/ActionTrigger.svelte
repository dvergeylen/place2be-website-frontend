<script>
  import { capitalizeFirstLetter } from '../../../../../../javascripts/utils/helpers';
  export let formPrefix;
  export let condition;
  export let underlyings;
  let underlying;

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

  const comparisonEnum = {
    eq: '= equal to',
    gteq: '≥ greater than or equal to',
    lteq: '≤ less than or equal to',
    shortlist: '[⟷] within',
  }

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
      Trigged <strong>'{underlying.attributes.name}'</strong>
      <ul>
        <li>
          mininum
          <strong>
            {condition.attributes.criteria.count}
            {parseInt(condition.attributes.criteria.count) === 1 ? 'time' : 'times'}
          </strong>;
        </li>
        {#each condition.attributes.criteria.validations as validation, i (i)}
          <li>
            with a <strong>{validation.attribute}</strong> {comparisonEnum[validation.comparison]}
            <strong>
              {validation.value}
            </strong>;

            {#if formPrefix}
              <input type="hidden" name="{formPrefix}[criteria][validations][{i}][attribute]"
              value="{validation.attribute}">
              <input type="hidden" name="{formPrefix}[criteria][validations][{i}][comparison]"
              value="{validation.comparison}">
              <input type="hidden" name="{formPrefix}[criteria][validations][{i}][value]"
              value="{validation.value}">
            {/if}
          </li>
        {/each}
        <li>
          over the <strong>{periodEnum[condition.attributes.criteria.period]}</strong>.
        </li>
      </ul>
    </div>
    {#if formPrefix}
      <div class="column is-narrow">
        <svg class="fa fill-destroy" on:click={destroyCondition}>
          <use href="../images/fontawesome-sprite.svg#regular-times-circle" />
        </svg>
      </div>
    {/if}
  </div>

  {#if formPrefix}
    <input type="hidden" name="{formPrefix}[criteria][count]"
      value="{condition.attributes.criteria.count}">

    <input type="hidden" name="{formPrefix}[criteria][period]"
    value="{condition.attributes.criteria.period}">

    <input type="hidden" name="{formPrefix}[inverted]"
      value="{condition.attributes.inverted}">

    <input type="hidden" name="{formPrefix}[underlying_type]"
      value="{capitalizeFirstLetter(condition.relationships.underlying.data.type)}">

    <input type="hidden" name="{formPrefix}[underlying_id]"
      value="{condition.relationships.underlying.data.id}">

    <input type="hidden" name="{formPrefix}[condition_type]" value="action_trigger">

    {#if condition.attributes._destroy}
      <input type="hidden" name="{formPrefix}[_destroy]" value="true">
    {/if}
  {/if}
</div>


<style lang="scss">
  .check {
    fill: #0096df;
  }
  ul {
    font-size: 0.8em;
    font-style: italic;
    margin-top: 0.5em;
  }
  .not {
    color: #c40000;
  }
</style>