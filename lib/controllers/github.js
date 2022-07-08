const { Router } = require('express');
const GithubUser = require('../models/GithubUser');
const jwt = require('jsonwebtoken');
const { exchangeCodeForToken, getGithubProfile } = require('../services/github');
const authenticate = require('../middleware/authenticate');

const ONE_DAY_IN_MS = 24 * 60 * 60 * 1000;

module.exports = Router()
  .get('/login', async (req, res) => {
    //TODO: kickoff the github oauth flow
    res.redirect(`https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}&scope=user&redirect_uri=${process.env.GITHUB_REDIRECT_URI}`);
  })
  .get('/callback', async (req, res) => {
    // TODO:
    // * get code
    const { code } = req.query;

    // * exchange code for token
    const githubToken = await exchangeCodeForToken(code);
    // * get info from github about user with token
    const githubProfileInfo = await getGithubProfile(githubToken);
    // * get existing user if there is one
    let user = await GithubUser.findByUsername(githubProfileInfo.login);
    // * if not, create one
    if (!user) {
      user = await GithubUser.insert({
        username: githubProfileInfo.login,
        email: githubProfileInfo.email,
        avatar: githubProfileInfo.avatar_url
      });
    }
    // * creat jwt
    const payload = jwt.sign(user.toJSON(), process.env.JWT_SECRET, {
      expiresIn: '1 day'
    });
    // * set cookie and redirect
    res
      .cookie(process.env.COOKIE_NAME, payload, {
        httpOnly: true,
        maxAge: ONE_DAY_IN_MS
      })
      .redirect('/api/v1/github/dashboard');
  })
  .get('/dashboard', authenticate, async (req, res) => {
    // require req.user
    // get data about user and send it as json
    res.json(req.user);
  });
  // .delete('/sessions', (req, res) => {
  //   res
  //     .clearCookie(process.env.COOKIE_NAME)
  //     .json({ success: true, message: 'Signed out successfully' });
  // });
