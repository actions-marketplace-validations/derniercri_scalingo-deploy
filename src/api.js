const core = require('@actions/core');
const { apiUrl, token, appName } = require('./constants');

const createDeployment = (bearerToken, gitRef) => fetch(`${apiUrl}/v1/apps/${appName}/deployments`, {
  method: 'POST',
  body: JSON.stringify({ deployment: { git_ref: gitRef } }),
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
