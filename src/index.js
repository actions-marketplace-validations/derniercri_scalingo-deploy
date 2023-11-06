const core = require('@actions/core');
const github = require('@actions/github');
const { createDeployment, getBearerToken } = require('./api');

const formattedRef = () => {
  const { ref, eventName, headRef } = github.context;

  if (eventName === 'pull_request') {
    return headRef;
  }

  if (ref.startsWith('refs/heads/')) {
    return ref.replace('refs/heads/', '');
  }
  if (ref.startsWith('refs/tags/')) {
    return ref.replace('refs/tags/', '');
  }

  return ref;
};

const getSourceUrl = () => {
  const { ref, eventName, headRef, serverUrl, repo } = github.context;

  const requiredRef = eventName ==='pull_request' ? `refs/heads/${headRef}` : ref

  return `${serverUrl}/${repo.owner}/${repo.repo}/archive/${requiredRef}.tar.gz`
}

const main = async () => {
  try {
    const { token } = await getBearerToken();
    const ref = formattedRef();
    const sourceUrl = getSourceUrl()

    core.debug(`Bearer token: ${token}`);
    core.info(`Ref: ${ref}`);
    core.info(`Source URL: ${sourceUrl}`);

    await createDeployment(token, ref, sourceUrl);
  } catch (err) {
    core.error(err);
  }
};

main();
