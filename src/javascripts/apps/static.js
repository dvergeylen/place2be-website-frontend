/*
 * Static APP → When user isn't connected
 */

/* Login */
import {
  configureClient,
} from '../utils/auth0';

/* Components */
import Auth from '../../components/Auth.svelte';

const app = (async () => {
  await configureClient();

  const auth = new Auth({
    target: document.getElementById('signin-container'),
    props: {},
  });
})();

export default app;
