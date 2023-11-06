const core = require('@actions/core');

const apiUrl = core.getInput('apiUrl');
const appName = core.getInput('appName');
const token = core.getInput('token');

module.exports = { apiUrl, appName, token };
