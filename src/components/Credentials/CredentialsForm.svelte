<script>
  import { createUrl } from '../../javascripts/utils/helpers';
  import { postFormData } from '../../javascripts/utils/helpers';
  export let apiProtocol;
  export let apiHost;

  const params = new URLSearchParams(window.location.search);
  let showSignIn = !params.has('signup');

  let error = {
    signin: '',
    signup: '',
  };

  async function handleSubmit(path, formId) {
    const url = createUrl(apiProtocol, apiHost, path);
    const formData = new FormData(document.getElementById(formId));
    const res = await postFormData(url, formData);

    if (!res.ok) {
      const t = await res.text();
      error[path] = JSON.parse(t);
    } else {
      /* Redirect to dashboard */
      const url = createUrl(window.location.protocol,
      window.location.host, 'dashboard.html');
      window.location.replace(url);
    }
  }

  function handleSignIn() {
    handleSubmit('signin', 'signin-form');
  }

  function handleSignUp() {
    handleSubmit('signup', 'signup-form');
  }

  function toggleShowSignIn() {
    showSignIn = !showSignIn;
  }

  function flushError(key) {
    error[key] = '';
  }
</script>

<div id="signin" class:is-hidden="{!showSignIn}">
  <h1 class="title is-4">
    Sign in :
  </h1>

  <form id="signin-form" on:submit|preventDefault={handleSignIn}>
    <div class="notification is-warning" class:is-hidden={!error['signin']}>
      <button class="delete" on:click|preventDefault={() => flushError('signin')} ></button>
      <h1 class='title is-5'>
        Unable to Sign in
      </h1>
      <ul>
        {#each Object.entries(error['signin']) as [ key, ar ]}
          <li>{key} : {ar}</li>
        {/each}
      </ul>
    </div>

    <div class="field">
      <label class="label">
        Email :
        <span class="mandatory">*</span>
      </label>
      <div class="control">
        <input name="user[email]" class="input reasonable-width" type="text">
      </div>
    </div>

    <div class="field">
      <label class="label">
        Password :
        <span class="mandatory">*</span>
      </label>
      <div class="control">
        <input name="user[password]" class="input reasonable-width" type="password">
      </div>
    </div>

    <div class="field is-grouped">
      <div class="control">
        <button class="button is-link">Sign In</button>
      </div>
      <div class="control">
        <a href='javascript:void(0)' class="button is-link is-outlined" on:click={toggleShowSignIn}>Sign Up</a>
      </div>
      <div class="control">
        <a href="/index.html" class="button is-link is-light">Cancel</a>
      </div>
    </div>
  </form>
</div>






<div id="signup" class:is-hidden="{showSignIn}">
  <h1 class="title is-4">
    Sign up :
  </h1>

  <form id="signup-form" on:submit|preventDefault={handleSignUp}>
    <div class="notification is-danger" class:is-hidden={!error['signup']}>
      <button class="delete" on:click|preventDefault={() => flushError('signup')}></button>
      <h1 class='title is-5'>
        Unable to Sign up
      </h1>
      <ul>
        {#each Object.entries(error['signup']) as [ key, ar ]}
          <li>{key} : {ar.join(', ')}</li>
        {/each}
      </ul>
    </div>

    <div class="field">
      <label class="label">
        Name :
        <span class="mandatory">*</span>
      </label>
      <div class="control">
        <input name="user[name]" class="input reasonable-width" type="text">
      </div>
    </div>

    <div class="field">
      <label class="label">
        Email :
        <span class="mandatory">*</span>
      </label>
      <div class="control">
        <input name="user[email]" class="input reasonable-width" type="text">
      </div>
    </div>

    <div class="field">
      <label class="label">
        Password :
        <span class="mandatory">*</span>
      </label>
      <div class="control">
        <input name="user[password]" class="input reasonable-width" type="password">
      </div>
    </div>

    <div class="field">
      <label class="label">
        Password Confirmation:
        <span class="mandatory">*</span>
      </label>
      <div class="control">
        <input name="user[password_confirmation]" class="input reasonable-width" type="password">
      </div>
    </div>

    <div class="field is-grouped">
      <div class="control">
        <button class="button is-link">Sign Up</button>
      </div>
      <div class="control">
        <a href='javascript:void(0)' class="button is-link is-outlined" on:click={toggleShowSignIn}>Sign In</a>
      </div>
      <div class="control">
        <a href="/index.html" class="button is-link is-light">Cancel</a>
      </div>
    </div>
  </form>
</div>