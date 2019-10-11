const express = require('express');
const router = express.Router();

const googleService = require('../../services/google');
const casService = require('../../services/cas');

const { Account } = require('../../db/models');

module.exports = (aips) => {
  const { nextApp, csrf } = aips;
  const middlewares = require('../middlewares')(aips);
  const cas = casService.createConnection();
  
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

  router.get('/cas', csrf, cas.bounce, asyncMiddleware(async(req, res) => {
    res.redirect('/auth/callback/cas');
  }));

  router.get('/callback/cas', csrf, asyncMiddleware(async(req, res) => {
    // console.log(req.session);
    const user = req.session.cas_user.toLowerCase();
    const email = user + '@rpi.edu';
    // TODO currently will use RCS ID for user ==> can we access RIN?
    const account = await Account.createOrLink('cas', user, email);
    req.session.user = account.User;
    req.session.save((err) => {
      res.redirect('/user');
    });
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