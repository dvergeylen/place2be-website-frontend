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
          {#if selectedTab === 'overview'}
            <svg class="fa">
              <use href="../images/fontawesome-sprite.svg#solid-sitemap" />
            </svg>
          {:else}
            <svg class="fa unselected">
              <use href="../images/fontawesome-sprite.svg#light-sitemap" />
            </svg>
          {/if}
          <span class="left-spaced">Overview</span>
        </a>
      </li>
      <li class:is-active={selectedTab === 'actions'}>
        <a href="javascript:void(0)"
          on:click|preventDefault={async () => updateSelectedTab('actions')}>
          {#if selectedTab === 'actions'}
            <svg class="fa">
              <use href="../images/fontawesome-sprite.svg#solid-running" />
            </svg>
          {:else}
            <svg class="fa unselected">
              <use href="../images/fontawesome-sprite.svg#light-running" />
            </svg>
          {/if}
          <span class="left-spaced">Actions</span>
        </a>
      </li>
      <li class:is-active={selectedTab === 'achievements'}>
        <a href="javascript:void(0)"
          on:click|preventDefault={async () => updateSelectedTab('achievements')}>
          {#if selectedTab === 'achievements'}
            <svg class="fa">
              <use href="../images/fontawesome-sprite.svg#solid-trophy" />
            </svg>
          {:else}
            <svg class="fa unselected">
              <use href="../images/fontawesome-sprite.svg#light-trophy" />
            </svg>
          {/if}
          <span class="left-spaced">Achievements</span>
        </a>
      </li>
      <li class:is-active={selectedTab === 'rewards'}>
        <a href="javascript:void(0)"
          on:click|preventDefault={async () => updateSelectedTab('rewards')}>
          {#if selectedTab === 'rewards'}
            <svg class="fa">
              <use href="../images/fontawesome-sprite.svg#solid-gifts" />
            </svg>
          {:else}
            <svg class="fa unselected">
              <use href="../images/fontawesome-sprite.svg#light-gifts" />
            </svg>
          {/if}
          <span class="left-spaced">Rewards</span>
        </a>
      </li>
      <li class:is-active={selectedTab === 'stats'}>
        <a href="javascript:void(0)"
          on:click|preventDefault={async () => updateSelectedTab('stats')}>
          {#if selectedTab === 'stats'}
            <svg class="fa">
              <use href="../images/fontawesome-sprite.svg#solid-chart-bar" />
            </svg>
          {:else}
            <svg class="fa unselected">
              <use href="../images/fontawesome-sprite.svg#light-chart-bar" />
            </svg>
          {/if}
          <span class="left-spaced">Stats</span>
        </a>
      </li>
      <li class:is-active={selectedTab === 'dev'}>
        <a href="javascript:void(0)"
          on:click|preventDefault={async () => updateSelectedTab('dev')}>
          {#if selectedTab === 'dev'}
            <svg class="fa">
              <use href="../images/fontawesome-sprite.svg#solid-code" />
            </svg>
          {:else}
            <svg class="fa unselected">
              <use href="../images/fontawesome-sprite.svg#light-code" />
            </svg>
          {/if}
          <span class="left-spaced">Dev. / Integration</span>
        </a>
      </li>
      <li class:is-active={selectedTab === 'settings'}>
        <a href="javascript:void(0)"
          on:click|preventDefault={async () => updateSelectedTab('settings')}>
          {#if selectedTab === 'settings'}
            <svg class="fa">
              <use href="../images/fontawesome-sprite.svg#solid-cogs" />
            </svg>
          {:else}
            <svg class="fa unselected">
              <use href="../images/fontawesome-sprite.svg#light-cogs" />
            </svg>
          {/if}
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
</style>