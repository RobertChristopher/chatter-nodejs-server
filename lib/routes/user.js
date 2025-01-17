import express from 'express';
import { user } from '../models/'
import Promise from 'bluebird'
import { user_scope } from '../auth/'
const router = express.Router();


router.post('/', user_scope, function (req, res, next) {

  var oauth_token = req.user.oauth_token
  var oauth_secret = req.user.oauth_secret
  var user_id = req.user.id

  if(!oauth_token || !oauth_secret) {
    return next(new Error()
      .body = {
        message: 'Missing oauth token or oauth secret',
        status: 400
      })
  }

  var subject = new user({
    twitter_oauth_token: oauth_token,
    twitter_oauth_token_secret: oauth_secret,
    user_id: user_id
  })

  subject.save((err, response) => {

    if(err) {
      return next(new Error()
        .body = {
          message: 'Error encountered while creating account',
          status: 500
        })
    }

    res.sendStatus(201)
      .send()

  })

})

export default router