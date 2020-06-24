<script>
  import { game } from '../../../javascripts/stores/gameStore';
  let created_at;

  $: created_at = new Date($game.data.attributes.created_at);
</script>


<ul>
  <li>Created : {created_at.toLocaleDateString()}</li>
  <li>Active: {$game.data.attributes.archived ? 'No' : 'Yes'}</li>
</ul>