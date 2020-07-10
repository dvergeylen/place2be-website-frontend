<script>
  import { createEventDispatcher } from 'svelte';
  import { game } from '../../javascripts/stores/gameStore';
  export let selectedTab = 'overview';

  const dispatch = createEventDispatcher();

  function updateSelectedTab(selectedTab) {
    dispatch('message', {
      selectedTab,
    });
  }
</script>


<div id="game-tabs-container" class="tabs">
  <ul>
    <li class:is-active={selectedTab === 'overview'}>
      <!-- svelte-ignore a11y-missing-attribute -->
      <a
        on:click|preventDefault={() => updateSelectedTab('overview')}>
        <svg class="twemoji">
          <use href="../images/twemoji-sprite.svg#compass" />
        </svg>
        <span class="left-spaced">Overview</span>
      </a>
    </li>
    <li class:is-active={selectedTab === 'actions'}>
      <!-- svelte-ignore a11y-missing-attribute -->
      <a
        on:click|preventDefault={() => updateSelectedTab('actions')}>
        <svg class="twemoji">
          <use href="../images/twemoji-sprite.svg#high_voltage_sign" />
        </svg>
        <span class="left-spaced">Actions</span>
      </a>
    </li>
    <li class:is-active={selectedTab === 'achievements'}>
      <!-- svelte-ignore a11y-missing-attribute -->
      <a
        on:click|preventDefault={() => updateSelectedTab('achievements')}>
        <svg class="twemoji">
          <use href="../images/twemoji-sprite.svg#trophy" />
        </svg>
        <span class="left-spaced">Achievements</span>
      </a>
    </li>
    <li class:is-active={selectedTab === 'resources'}>
      <!-- svelte-ignore a11y-missing-attribute -->
      <a
        on:click|preventDefault={() => updateSelectedTab('resources')}>
        <svg class="twemoji">
          <use href="../images/twemoji-sprite.svg#sparkles" />
        </svg>
        <span class="left-spaced">Resources</span>
      </a>
    </li>
    <li class:is-active={selectedTab === 'stats'}>
      <!-- svelte-ignore a11y-missing-attribute -->
      <a
        on:click|preventDefault={() => updateSelectedTab('stats')}>
        <svg class="twemoji">
          <use href="../images/twemoji-sprite.svg#bar_chart" />
        </svg>
        <span class="left-spaced">Stats</span>
      </a>
    </li>
    <li class:is-active={selectedTab === 'dev'}>
      <!-- svelte-ignore a11y-missing-attribute -->
      <a
        on:click|preventDefault={() => updateSelectedTab('dev')}>
        <svg class="twemoji">
          <use href="../images/twemoji-sprite.svg#woman_technologist" />
        </svg>
        <span class="left-spaced">Integration</span>
      </a>
    </li>
    <li class:is-active={selectedTab === 'settings'}>
      <!-- svelte-ignore a11y-missing-attribute -->
      <a
        on:click|preventDefault={() => updateSelectedTab('settings')}>
        <svg class="twemoji">
          <use href="../images/twemoji-sprite.svg#gear" />
        </svg>
        <span class="left-spaced">Settings</span>
      </a>
    </li>
  </ul>
</div>

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