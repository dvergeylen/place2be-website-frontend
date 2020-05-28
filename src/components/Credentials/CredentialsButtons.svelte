<script>
  import { onMount } from 'svelte';
  import { path2url, getCookie } from '../../javascripts/utils/helpers';
  import { postFormData } from '../../javascripts/utils/helpers';
  export let frontend_api_url;

  let authenticated = false;

  onMount(async () => {
    console.log(document.cookie);
    authenticated = getCookie(document.cookie, 'is_authenticated');
  });

  async function signout() {
    const url = `${frontend_api_url}/signout`;
    const res = await postFormData(url, undefined);

    /* Redirect to landing page */
    window.location.replace(path2url('index.html'));
  }
</script>

<div class="buttons">
  <a href={path2url('credentials.html')} class="button is-link is-outlined fill-primary" class:is-hidden="{authenticated}">
    <span class="icon is-small">
      <svg class="fa">
        <use href="../images/fontawesome-sprite.svg#solid-sign-in" />
      </svg>
    </span>
    <span>
      Sign In
    </span>
  </a>
  <a href='javascript:void(0)' class="button is-link is-outlined fill-primary"  class:is-hidden="{!authenticated}">
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
  <a href={path2url('credentials.html?signup=true')} class="button is-link is-outlined fill-primary" class:is-hidden="{authenticated}">
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
  .fa {
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