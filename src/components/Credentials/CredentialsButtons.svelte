<script>
  import { onMount } from 'svelte';
  import { createUrl, getCookie } from '../../javascripts/utils/helpers';
  import { postFormData } from '../../javascripts/utils/helpers';
  export let apiProtocol;
  export let apiHost;

  let authenticated = false;

  onMount(async () => {
    authenticated = getCookie(document.cookie, 'user_id');
  });

  async function signout() {
    const url = createUrl(apiProtocol, apiHost, 'signout');
    const res = await postFormData(url, undefined);

    /* Redirect to landing page */
    window.location.replace(createUrl(window.location.protocol,
      window.location.host, 'index.html'));
  }
</script>

<div class="buttons">
  <a href="/credentials.html" class="button is-link is-outlined fill-primary" class:is-hidden="{authenticated}">
    <span class="icon is-small">
      <svg class="fa">
        <use href="../images/fontawesome-sprite.svg#solid-sign-in" />
      </svg>
    </span>
    <span>
      Sign In
    </span>
  </a>
  <a href='/settings.html' class="button is-link is-outlined fill-primary"  class:is-hidden="{!authenticated}">
    <span class="icon is-small">
      <svg class="fa">
        <use href="../images/fontawesome-sprite.svg#solid-cog" />
      </svg>
    </span>
    <span>
      Settings
    </span>
  </a>
  <button id="sign-out" class="button is-link fill-secondary" class:is-hidden="{!authenticated}" on:click={signout}>
    <span class="icon is-small">
      <svg class="fa">
        <use href="../images/fontawesome-sprite.svg#solid-sign-out" />
      </svg>
    </span>
    <span>
      Sign Out
    </span>
  </button>
  <a href="/credentials.html?signup=true" class="button is-link is-outlined fill-primary" class:is-hidden="{authenticated}">
    <span class="icon is-small">
      <svg class="fa">
        <use href="../images/fontawesome-sprite.svg#solid-sign-in-alt" />
      </svg>
    </span>
    <span>
      Sign Up
    </span>
  </a>
</div>

<style lang='scss'>
</style>