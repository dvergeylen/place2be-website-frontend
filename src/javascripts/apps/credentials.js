/*
 * Static APP → When user isn't connected
 */

/* config */
import config from '../../../public-config.json'; // ⚠️ Not commited config

/* Stylesheets */
import '../../stylesheets/navbar.scss';

/* Login */

/* Components */
import CredentialsForm from '../../components/Credentials/CredentialsForm.svelte';

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
