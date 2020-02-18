const express = require('express');
const router = express.Router();
const { google } = require('googleapis');

const { body } = require('express-validator');
const validator = {};

const googleService = require('../../services/google');
const cas = require('../../services/cas');

const { Account, User } = require('../../db/models');

module.exports = (aips) => {
  const { nextApp, csrf } = aips;
  const middlewares = require('../middlewares')(aips);
  
  const {
    async: asyncMiddleware,
    validateBody,
  } = middlewares;

  router.get('/google', (req, res) => {
    const url = googleService.urlGoogle();
    res.redirect(url);
  });

  // https://support.google.com/cloud/answer/7454865?authuser=0
  // DON'T CREATE USER, BUT ONLY LINK
  // ONLY ACCESSES THE CALENDARS ON SESSION => FUNC FOR ACCESS ALL THE TIME?
  router.get('/google/callback', asyncMiddleware(async(req, res) => {
    const userId = req.session.user ? req.session.user.id : 0;
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).send({ error: 'user not found' });
    }
    const { code } = req.query;
    // const { id, email, tokens, calendar }  = await googleService.getGoogleAccountFromCode(code);
    const calendar = await googleService.getGoogleAccountFromCode(code);
    // const account = await Account.createOrLink('google', id, email);
    // const account = await Account.linkAccount('google', id, user.id);
    // req.session.user = account.User;
    // console.log(calendar.calendarList.list());
    console.log(calendar.calendarList.list());
    req.session.calendar = calendar;
    req.session.save((err) => {
      res.redirect('/user');
    });
  }));

  validator.addToCalendar = [
    body('groupId').exists(),
    body('startDate').not().isEmpty().trim(),
    body('startTime').not().isEmpty().trim(),
    body('endDate').not().isEmpty().trim(),
    body('endTime').not().isEmpty().trim(),
    body('name').not().isEmpty().trim(),
    body('description').exists().trim(),
    body('Group').exists(),
  ];

  router.post('/google/addToCalendar', csrf, validator.addToCalendar, validateBody, asyncMiddleware(async(req, res) => {
    // Create an authorized client
    try {
      const auth = googleService.createConnection();
      const googleCalendar = google.calendar({ version: 'v3', auth });
      
      console.log(googleCalendar.calendarList.list());

      const { groupId, startDate, startTime, endDate, endTime, name, description, image, Group } = req.body;
      const userId = req.session.user.id;
      const user = await User.findByPk(userId);
      if (!user) {
          return res.status(404).send({ error: 'User not found' });
      }

      const newEvent = {
        summary: name,
        description: description,
        organizer: {
            displayName: Group.name,
            email: Group.groupEmail,
        },
        start: {
            date: startDate
        },
        end: {
            date: endDate
        },
      };

      await googleCalendar.events.insert({
          calendarId: 'primary',
          resource: newEvent,
        }, function(err, newEvent) {
          if (err) {
            console.log('There was an error contacting the Calendar service: ' + err);
            return;
          }
          console.log('Event created: %s', newEvent.htmlLink);
        });

      res.json({ googleCalendar });
    }
    catch(err) {
      console.log(err);
    }
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