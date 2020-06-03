<script>
  import { game } from '../../../javascripts/stores/gameStore';
  let created_at;

  $: created_at = new Date($game.attributes.created_at);
</script>

{#if !$game}
  <div class="has-vcentered-content">
    <svg class="fa rotating">
      <use href="../images/fontawesome-sprite.svg#regular-sync-alt" />
    </svg>
    <p class="left-spaced">Loading Game Overview</p>
  </div>
{:else}
  <ul>
    <li>Created : {created_at.toLocaleDateString()}</li>
    <li>Active: {$game.attributes.archived ? 'No' : 'Yes'}</li>
  </ul>
{/if}