const core = require('@actions/core');
const github = require('@actions/github');
const { apiUrl, token, appName } = require('./constants');

const createDeployment = (bearerToken, gitRef) => fetch(`${apiUrl}/v1/apps/${appName}/deployments`, {
  method: 'POST',
  body: JSON.stringify({
    deployment: {
      git_ref: gitRef,
      source_url: `${github.context.serverUrl}/${github.context.repo.owner}/${github.context.repo.repo}/archive/${github.context.ref}.tar.gz`,
    },
  }),
  headers: {
    Authorization: `Bearer ${bearerToken}`,
    'Content-Type': 'application/json',
  },
})
  .then((res) => {
    core.debug(res);
    return res;
  })
  .then((res) => res.json());

const getBearerToken = () => fetch('https://auth.scalingo.com/v1/tokens/exchange', {
  method: 'POST',
  headers: {
    Authorization: `Basic ${Buffer.from(`:${token}`).toString('base64')}`,
    'Content-Type': 'application/json',
  },
})
  .then((res) => res.json());

module.exports = {
  createDeployment,
  getBearerToken,
};
