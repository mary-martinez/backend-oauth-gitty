const { Router } = require('express');

module.exports = Router()
  .get('/login', async (req, res) => {
    //TODO: kickoff the github oauth flow
    res.redirect(`https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}&scope=user&redirect_uri=${process.env.GITHUB_REDIRECT_URI}`);
  })
  .get('/callback', async (req, res) => {
    const { code } = req.query;
    res.json({ code });
    /*
    
    TODO:
    * get code
    * exchange code for token
    * get info from github about user with token
    * get existing user if there is one
    * if not, create one
    * creat jwt
    * set cookie and redirect
    */
  });
  // .get('/dashboard', authenticate, async (req, res) => {
  //   // require req.user
  //   // get data about user and send it as json
  // })
  // .delete('/sessions', (req, res) => {
  //   res
  //     .clearCookie(process.env.COOKIE_NAME)
  //     .json({ success: true, message: 'Signed out successfully' });
  // });