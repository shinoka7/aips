const express = require('express');
const router = express.Router();

const googleService = require('../../services/google');
const cas = require('../../services/cas');

const { Account } = require('../../db/models');

module.exports = (aips) => {
  const { nextApp, csrf } = aips;
  const middlewares = require('../middlewares')(aips);
  
  const {
    async: asyncMiddleware,
  } = middlewares;

  router.get('/google', (req, res) => {
    const url = googleService.urlGoogle();
    res.redirect(url);
  });

  router.get('/google/callback', asyncMiddleware(async(req, res) => {
    const { code } = req.query;
    const { id, email, tokens }  = await googleService.getGoogleAccountFromCode(code);
    const account = await Account.createOrLink('google', id, email);
    req.session.user = account.User;
    req.session.save((err) => {
      res.redirect('/user');
    });
  }));

  router.get('/cas', cas.bounce, asyncMiddleware(async(req, res) => {
    try {
      const user = req.session[cas.session_name].toLowerCase();
      const email = user + '@rpi.edu';
      // TODO currently will use RCS ID for user ==> can we access RIN?
      const account = await Account.createOrLink('cas', user, email);
      req.session.user = account.User;
      req.session.save((err) => {
        res.redirect('/user');
      });
    }
    catch (err) {
      console.log(err);
    }
  }));

  router.get('/logout', (req, res) => {
    if (req.session) {
      req.session.destroy((err) => {
        if (err) {
          return nextApp(err);
        } else {
          return res.redirect("/login");
        }
      })
    }
  });

    return router;
};