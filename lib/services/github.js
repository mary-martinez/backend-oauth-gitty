const fetch = require('cross-fetch');

const exchangeCodeForToken = async (code) => {
  // TODO: implement this exchange
  // make a request to github with the code, client id, & secret
  // github should send back a token
  const client_id = process.env.GITHUB_CLIENT_ID;
  const client_secret = process.env.GITHUB_CLIENT_SECRET;

  const response = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ client_id, client_secret, code })
  });
  const respBody = await response.json();
  return respBody.access_token;
};

const getGithubProfile = async (token) => {
  // TODO: implement this 
  const response = await fetch('https://api.github.com/user', {
    headers: {
      Authorization: `token ${token}`,
      Accept: 'application/vnd.github.v3+json'
    }
  });
  const resp = await response.json();
  return resp;
};

module.exports = { exchangeCodeForToken, getGithubProfile };
