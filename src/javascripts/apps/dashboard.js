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
} from '../utils/auth0';

/* Components */
import Users from '../../components/Users.svelte';
import Auth from '../../components/Auth.svelte';

const app = (async () => {
  await configureClient();
  const token = await getToken();

  // eslint-disable-next-line no-unused-vars
  const auth = new Auth({
    target: document.getElementById('signin-container'),
    props: {},
  });

  // eslint-disable-next-line no-unused-vars
  const users = new Users({
    target: document.getElementById('main'),
    props: {
      token,
    },
  });
})();


export default app;
