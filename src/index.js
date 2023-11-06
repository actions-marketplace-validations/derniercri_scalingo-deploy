const core = require('@actions/core');
const github = require('@actions/github');
const { createDeployment, getBearerToken } = require('./api');

const getSourceUrl = () => {
  const {
    sha,
    serverUrl,
    repo,
  } = github.context;

  return `${serverUrl}/${repo.owner}/${repo.repo}/archive/${sha}.tar.gz`;
};

const main = async () => {
  try {
    const {
      sha,
    } = github.context;
    const { token } = await getBearerToken();
    const sourceUrl = getSourceUrl();

    core.debug(`Bearer token: ${token}`);
    core.info(`Sha: ${sha}`);
    core.info(`Source URL: ${sourceUrl}`);

    await createDeployment(token, sha);
  } catch (err) {
    core.error(err);
  }
};

main();
