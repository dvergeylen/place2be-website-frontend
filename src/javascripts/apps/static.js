/*
 * Static APP → When user isn't connected
 */

/* config */
import config from '../../../public-config.json';

/* Javascripts */
import { setNavbarToggle } from '../utils/helpers';

/* Stylesheets */
import '../../stylesheets/navbar.scss';
import '../../stylesheets/landing.scss';

/* Components */
import CredentialsButtons from '../../components/Credentials/CredentialsButtons.svelte';

/* Navbar toggle */
setNavbarToggle();

const app = (async () => {
  // eslint-disable-next-line no-unused-vars
  const auth = new CredentialsButtons({
    target: document.getElementById('credentials-buttons'),
    props: {
      apiProtocol: config.api.protocol,
      apiHost: config.api.host,
    },
  });
})();

export default app;
