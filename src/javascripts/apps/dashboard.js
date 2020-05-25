/*
 * Users APP
 */

/* Stylesheets */
import '../../stylesheets/navbar.scss';
import '../../stylesheets/dashboard.scss';

/* Login */
import {
  configureClient,
  getToken,
  getIdTokenClaims,
} from '../utils/auth0';

/* Components */
import Dashboard from '../../components/Dashboard/Dashboard.svelte';
import Auth from '../../components/Auth.svelte';

const app = (async () => {
  await configureClient();
  const token = await getToken();
  const claims = await getIdTokenClaims();

  // eslint-disable-next-line no-unused-vars
  const auth = new Auth({
    target: document.getElementById('signin-container'),
    props: {},
  });

  // eslint-disable-next-line no-unused-vars
  const dashboard = new Dashboard({
    target: document.getElementById('main'),
    props: {
      token,
      claims,
    },
  });
})();


export default app;
