/*
 * Credential APP
 */

/* config */
import config from '../../../public-config.json';

/* Javascripts */
import { setNavbarToggle } from '../utils/helpers';

/* Stylesheets */
import '../../stylesheets/navbar.scss';

/* Components */
import CredentialsForm from '../../components/Credentials/CredentialsForm.svelte';

/* Navbar toggle */
setNavbarToggle();

const app = (async () => {
  // eslint-disable-next-line no-unused-vars
  const auth = new CredentialsForm({
    target: document.getElementById('credentials'),
    props: {
      apiProtocol: config.api.protocol,
      apiHost: config.api.host,
    },
  });
})();

export default app;
