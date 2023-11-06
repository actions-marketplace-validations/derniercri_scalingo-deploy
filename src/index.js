const core = require('@actions/core');
const github = require('@actions/github');
const { createDeployment, getBearerToken } = require('./api');

const formattedRef = () => {
  const { ref, event_name, head_ref } = github.context;

  if (event_name === 'pull_request') {
    return head_ref;
  }

  if (ref.startsWith('refs/heads/')) {
    return ref.replace('refs/heads/', '');
  }
  if (ref.startsWith('refs/tags/')) {
    return ref.replace('refs/tags/', '');
  }

  return ref;
};

const main = async () => {
  try {
    const { token } = await getBearerToken();
    const ref = formattedRef();
    core.debug(`Bearer token: ${token}`);
    core.debug(`Ref: ${ref}`);

    await createDeployment(token, formattedRef());
  } catch (err) {
    core.error(err);
  }
};

main();
