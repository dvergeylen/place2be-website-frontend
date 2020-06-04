<script>
  import { createEventDispatcher } from 'svelte';
  export let game;
  export let selectedTab = 'overview';

  const dispatch = createEventDispatcher();

  function updateSelectedTab(selectedTab) {
    dispatch('message', {
      selectedTab,
    });
  }
</script>


{#if !game}
  Loading Game tabs...
{:else}
  <div id="game-tabs-container" class="tabs">
    <ul>
      <li class:is-active={selectedTab === 'overview'}>
        <a href="javascript:void(0)"
          on:click|preventDefault={async () => updateSelectedTab('overview')}>
          <svg class="twemoji">
            <use href="../images/twemoji-sprite.svg#world_map" />
          </svg>
          <span class="left-spaced">Overview</span>
        </a>
      </li>
      <li class:is-active={selectedTab === 'actions'}>
        <a href="javascript:void(0)"
          on:click|preventDefault={async () => updateSelectedTab('actions')}>
          <svg class="twemoji">
            <use href="../images/twemoji-sprite.svg#high_voltage_sign" />
          </svg>
          <span class="left-spaced">Actions</span>
        </a>
      </li>
      <li class:is-active={selectedTab === 'achievements'}>
        <a href="javascript:void(0)"
          on:click|preventDefault={async () => updateSelectedTab('achievements')}>
          <svg class="twemoji">
            <use href="../images/twemoji-sprite.svg#trophy" />
          </svg>
          <span class="left-spaced">Achievements</span>
        </a>
      </li>
      <li class:is-active={selectedTab === 'rewards'}>
        <a href="javascript:void(0)"
          on:click|preventDefault={async () => updateSelectedTab('rewards')}>
          <svg class="twemoji">
            <use href="../images/twemoji-sprite.svg#wrapped_present" />
          </svg>
          <span class="left-spaced">Rewards</span>
        </a>
      </li>
      <li class:is-active={selectedTab === 'stats'}>
        <a href="javascript:void(0)"
          on:click|preventDefault={async () => updateSelectedTab('stats')}>
          <svg class="twemoji">
            <use href="../images/twemoji-sprite.svg#bar_chart" />
          </svg>
          <span class="left-spaced">Stats</span>
        </a>
      </li>
      <li class:is-active={selectedTab === 'dev'}>
        <a href="javascript:void(0)"
          on:click|preventDefault={async () => updateSelectedTab('dev')}>
          <svg class="twemoji">
            <use href="../images/twemoji-sprite.svg#woman_technologist" />
          </svg>
          <span class="left-spaced">Dev. / Integration</span>
        </a>
      </li>
      <li class:is-active={selectedTab === 'settings'}>
        <a href="javascript:void(0)"
          on:click|preventDefault={async () => updateSelectedTab('settings')}>
          <svg class="twemoji">
            <use href="../images/twemoji-sprite.svg#gear" />
          </svg>
          <span class="left-spaced">Settings</span>
        </a>
      </li>
    </ul>
  </div>
{/if}

<style lang='scss'>
  #game-tabs-container {
    margin-top: 1em;
    margin-bottom: 1em;
    font-size: 1.1em;
  }
  .left-spaced {
    margin-left: 0.5em;
  }
</style>