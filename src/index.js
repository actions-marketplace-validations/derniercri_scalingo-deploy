const core = require('@actions/core');
const github = require('@actions/github');
const { createDeployment, getBearerToken } = require('./api');

const formattedRef = () => {
  const { ref } = github.context;

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
    core.debug('Context: ', JSON.stringify(github.context));

    await createDeployment(token, formattedRef());
  } catch (err) {
    core.error(err);
  }
};

main();
