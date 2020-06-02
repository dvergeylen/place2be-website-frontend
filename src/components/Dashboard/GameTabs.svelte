<script>
  export let game;
  export let selectedTab;
</script>


{#if !game}
  Loading Game tabs...
{:else}
  <div id="game-tabs-container" class="tabs">
    <ul>
      <li class:is-active={selectedTab === 'overview'}>
        <a href="javascript:void(0)">
          <svg class="fa tab-item">
            <use href="../images/fontawesome-sprite.svg#solid-sitemap" />
          </svg>
          <span class="left-spaced">Overview</span>
        </a>
      </li>
      <li class:is-active={selectedTab === 'actions'}>
        <a href="javascript:void(0)">
          <svg class="fa tab-item">
            <use href="../images/fontawesome-sprite.svg#solid-running" />
          </svg>
          <span class="left-spaced">Actions</span>
        </a>
      </li>
      <li class:is-active={selectedTab === 'achievements'}>
        <a href="javascript:void(0)">
          <svg class="fa tab-item">
            <use href="../images/fontawesome-sprite.svg#solid-trophy" />
          </svg>
          <span class="left-spaced">Achievements</span>
        </a>
      </li>
      <li class:is-active={selectedTab === 'rewards'}>
        <a href="javascript:void(0)">
          <svg class="fa tab-item">
            <use href="../images/fontawesome-sprite.svg#solid-gifts" />
          </svg>
          <span class="left-spaced">Rewards</span>
        </a>
      </li>
      <li class:is-active={selectedTab === 'stats'}>
        <a href="javascript:void(0)">
          <svg class="fa tab-item">
            <use href="../images/fontawesome-sprite.svg#solid-chart-bar" />
          </svg>
          <span class="left-spaced">Stats</span>
        </a>
      </li>
      <li class:is-active={selectedTab === 'dev'}>
        <a href="javascript:void(0)">
          <svg class="fa tab-item">
            <use href="../images/fontawesome-sprite.svg#solid-code" />
          </svg>
          <span class="left-spaced">Dev. / Integration</span>
        </a>
      </li>
      <li class:is-active={selectedTab === 'settings'}>
        <a href="javascript:void(0)">
          <svg class="fa tab-item">
            <use href="../images/fontawesome-sprite.svg#solid-cogs" />
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
  .fa {
    width: 1em;
    height: 1em;
  }
  .left-spaced {
    margin-left: 0.5em;
  }
  svg.tab-item {
    fill: grey;
  }
</style>