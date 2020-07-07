<script>
  import { fade } from 'svelte/transition';
  import { fetchData } from '../../javascripts/utils/helpers';
  import { game } from '../../javascripts/stores/gameStore';
  import { savingStatus, lastSaveDate } from '../../javascripts/stores/savingStore';
  import GameTabs from './GameTabs.svelte';
  import Overview from './Tabs/Overview.svelte';
  import Collection from './Tabs/Collection.svelte';
  import Stats from './Tabs/Stats.svelte';
  import Dev from './Tabs/Dev.svelte';
  import Settings from './Tabs/Settings.svelte';

  export let gameUrl;
  let error = null;
  let selectedTab = 'overview';
  let collection;
  const tabs = {
    overview: Overview,
    actions: Collection,
    achievements: Collection,
    resources: Collection,
    stats: Stats,
    dev: Dev,
    settings: Settings,
  }
  const attributes = {
    actions: {
      name: {
        singular: 'action',
        plural: 'actions',
      },
      model: {
        singular: 'Action',
        plural: 'Actions',
      }
    },
    achievements: {
      name: {
        singular: 'achievement',
        plural: 'achievements',
      },
      model: {
        singular: 'Achievement',
        plural: 'Achievements',
      }
    },
    resources: {
      name: {
        singular: 'resource',
        plural: 'resources',
      },
      model: {
        singular: 'Resource',
        plural: 'Resources',
      }
    },
  };

  async function getGame(url) {
    const res = await fetchData(url);
    if (res.ok) {
      const resJson = await res.json();
      game.set(resJson);
    } else {
      error = 'Could not find the game you are looking for...';
    }
  }

  function handleNewSelectedTab(event) {
    selectedTab = event.detail.selectedTab;
  }

  // Update game Store when gameUrl is updated
  $: getGame(gameUrl);
  $: collection = $game && attributes[selectedTab] ?
                  $game.included.filter((e) => e.type === attributes[selectedTab].name.singular)
                                .sort((a, b) => parseInt(a.id) - parseInt(b.id)) :
                  [];
</script>

{#if !error}
  {#if !$game}
    <h1 class="title is-4 has-vcentered-content">
      Loading Game...
    </h1>
  {:else}
    <h1 class="title is-4 has-vcentered-content">
      <span id="saving-status">
        <abbr title="Last save : {$lastSaveDate.toLocaleString()}">
          <svg class="fa saved" class:is-hidden={$savingStatus != 'saved'}
            transition:fade="{{delay: 250, duration: 300}}">
            <use href="../images/fontawesome-sprite.svg#solid-check-circle" />
          </svg>
          <svg class="fa saving rotating" class:is-hidden={$savingStatus != 'saving'}
            transition:fade="{{delay: 250, duration: 300}}">
            <use href="../images/fontawesome-sprite.svg#solid-spinner-third" />
          </svg>
          <svg class="fa failed" class:is-hidden={$savingStatus != 'failed'}
            transition:fade="{{delay: 250, duration: 300}}">
            <use href="../images/fontawesome-sprite.svg#solid-times-circle" />
          </svg>
        </abbr>
      </span>
      {$game.data.attributes.name}
    </h1>
    <h1 id="game-description" class="subtitle is-6">{$game.data.attributes.description}</h1>

    <GameTabs {selectedTab} on:message={handleNewSelectedTab} />
    <svelte:component this={tabs[selectedTab]}
      attributes={attributes[selectedTab]}
      {collection}
      on:message/>
  {/if}
{:else}
  <div class="notification is-warning" class:is-hidden={!error}>
    <p>Could not load the game you are looking for...</p>
  </div>
{/if}

<style lang="scss">
  #saving-status {
    border-bottom-style: none;
    padding: 0.5em 0;
    margin-right: 0.5em;

    svg {
      vertical-align: middle;
    }

    .saved {
      fill: #73c90a;
    }
    .saving{
      fill: rgb(177, 177, 177);
    }
    .failed{
      fill: darkred;
    }
  }

  #game-description {
    margin-left: 2.3em;
  }
</style>