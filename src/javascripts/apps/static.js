/*
 * Static APP → When user isn't connected
 */

/* Stylesheets */
import '../../stylesheets/navbar.scss';
import '../../stylesheets/landing.scss';

/* Login */
import {
  configureClient,
} from '../utils/auth0';

/* Components */
import Auth from '../../components/Auth.svelte';

const app = (async () => {
  await configureClient();

  // eslint-disable-next-line no-unused-vars
  const auth = new Auth({
    target: document.getElementById('signin-container'),
    props: {},
  });
})();

export default app;
