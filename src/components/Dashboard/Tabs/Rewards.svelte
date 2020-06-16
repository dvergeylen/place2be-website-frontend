<script>
  import Reward from './Reward/Reward.svelte';
  import { fetchData } from '../../../javascripts/utils/helpers';
  import { game } from '../../../javascripts/stores/gameStore';

  let rewards = [];

  async function fetchRewards(game) {
    const url = game.relationships.rewards.links.related;
    const res = await fetchData(url);

    if (res.ok) {
      const resJson = await res.json();
      rewards = resJson.data;
    } else {
      error = 'Could not fetch Rewards for this game';
    }
  };

  function updateRewards(event) {
    rewards = event.detail.rewards;
  }
</script>

{#if !$game}
  <div class="has-vcentered-content">
    <svg class="fa rotating">
      <use href="../images/fontawesome-sprite.svg#regular-sync-alt" />
    </svg>
    <p class="left-spaced">Loading Game Rewards</p>
  </div>
{:else}
  {#if rewards.length}
    {#each rewards as reward (reward.id)}
      <Reward {reward} on:message={updateRewards}/>
    {/each}
  {:else}
    <p>You don't have Rewards yet! Start by creating one below ↓</p>
  {/if}



  <hr>
  <h1 class="title is-4">
    Create new Reward :
  </h1>
  <Reward on:message={updateRewards}/>
{/if}
