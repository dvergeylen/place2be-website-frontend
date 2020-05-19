<script>
  import { onMount } from 'svelte';
  import { path2url } from '../javascripts/utils/helpers';
  import {
    isAuthenticated,
    login,
    logout,
  } from '../javascripts/utils/auth0';

  let authenticated = false;
  const callbackUrl = path2url('dashboard.html');

  onMount(async () => {
    authenticated = await isAuthenticated();
  });
</script>

<div class="buttons">
  <button id="sign-in" class="button is-link fill-secondary" class:is-hidden="{authenticated}"
    on:click={async () => await login(callbackUrl)}>
    <span class="icon is-small">
      <svg class="credentials">
        <use href="../images/fontawesome-solid-sprite.svg#sign-in" />
      </svg>
    </span>
    <span>
      Sign In
    </span>
  </button>
  <button id="sign-out" class="button is-link fill-secondary" class:is-hidden="{!authenticated}" on:click={logout}>
    <span class="icon is-small">
      <svg class="credentials">
        <use href="../images/fontawesome-solid-sprite.svg#sign-out" />
      </svg>
    </span>
    <span>
      Sign Out
    </span>
  </button>
  <button class="button is-link is-outlined fill-primary" class:is-hidden="{authenticated}"
    on:click={async () => await login(callbackUrl)}>
    <span class="icon is-small">
      <svg class="credentials">
        <use href="../images/fontawesome-solid-sprite.svg#sign-in-alt" />
      </svg>
    </span>
    <span>
      Sign Up
    </span>
  </button>
</div>

<style lang='scss'>
  .credentials {
    width: 1em;
  }
  .fill-primary {
    fill: #0096df;
    &:hover {
      fill: white;
    }
  }
  .fill-secondary {
    fill: white;
  }
</style>