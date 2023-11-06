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

const getSourceUrl = () => {
  const { ref, event_name, head_ref, serverUrl, repo } = github.context;
  const requiredRef = event_name ==='pull_request' ? `refs/heads/${head_ref}` : ref

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
