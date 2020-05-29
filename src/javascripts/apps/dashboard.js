/*
 * Users APP
 */

/* config */
import config from '../../../local-config.json'; // ⚠️ Not commited config

/* Javascripts */
import { getCookie } from '../utils/helpers';

/* Stylesheets */
import '../../stylesheets/navbar.scss';
import '../../stylesheets/dashboard.scss';

/* Components */
import Dashboard from '../../components/Dashboard/Dashboard.svelte';
import CredentialsButtons from '../../components/Credentials/CredentialsButtons.svelte';

const app = (async () => {
  // Figure out: are we asking our own dashboard
  // or a distinct user's one?
  const params = new URLSearchParams(window.location.search);
  const userId = params.has('user_id')
    ? params.get('user_id')
    : getCookie(document.cookie, 'user_id');

  // eslint-disable-next-line no-unused-vars
  const auth = new CredentialsButtons({
    target: document.getElementById('credentials-buttons'),
    props: {
      apiProtocol: config.api.protocol,
      apiHost: config.api.host,
    },
  });

  // eslint-disable-next-line no-unused-vars
  const dashboard = new Dashboard({
    target: document.getElementById('main'),
    props: {
      apiProtocol: config.api.protocol,
      apiHost: config.api.host,
      userId,
    },
  });
})();


export default app;
