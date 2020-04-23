<script>
  import Auth from './Auth.svelte';
  let usersPromise;
  let token;

  async function getUserSettings(token) {
    const res = await fetch("http://localhost:3000/users", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    const text = await res.text();
    return text;
  };
  $: usersPromise = getUserSettings(token);
</script>

<main>
  <Auth bind:token={token}/>
  {#if token}
    <p>Token is {token}</p>
    {#await usersPromise}
      <p>Loading User settings</p>
    {:then users}
      <p>{users}</p>
    {:catch error}
      <p>An error occurred fetching User Settings!</p>
      <p>{error}</p>
    {/await}
  {:else}
    <p>No token received yet</p>
    <p>No users fetched yet</p>
  {/if}
</main>