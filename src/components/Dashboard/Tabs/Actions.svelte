<script>
  import { game } from '../../../javascripts/stores/gameStore';
</script>

{#if !$game}
  <div class="has-vcentered-content">
    <svg class="fa rotating">
      <use href="../images/fontawesome-sprite.svg#regular-sync-alt" />
    </svg>
    <p class="left-spaced">Loading Game Actions</p>
  </div>
{:else}
  <pre>
    {JSON.stringify($game, null, 4)}
  </pre>
{/if}
