// require needed modules
const express = require('express')
const passport = require('passport')

// require local modules
const Trip = require('./../models/trip.js') // mongoose Trip model
const customErrors = require('../../lib/custom_errors')

// we'll use this function to send 404 when non-existant document is requested
const handle404 = customErrors.handle404

// we'll use this function to send 401 when a user tries to modify a resource
// that's owned by someone else
const requireOwnership = customErrors.requireOwnership

// this is middleware that will remove blank fields from `req.body`, e.g.
// { example: { title: '', text: 'foo' } } -> { example: { text: 'foo' } }
const removeBlanks = require('../../lib/remove_blank_fields')

// passing this as a second argument to `router.<verb>` will make it
// so that a token MUST be passed for that route to be available
// it will also set `req.user`
const requireToken = passport.authenticate('bearer', { session: false })

// instantiate a router for trips
const router = express.Router()

// define routes
// index (GET)
router.get('/trips', requireToken, (req, res, next) => {
  // find all trips and send back as JSON response
  Trip.find({owner: req.user.id})
    .populate('owner')
    .then(trips => {
      res.status(200).json({trips})
    })
    .catch(next)
})

// create (POST)
router.post('/trips', requireToken, (req, res, next) => {
  // requireToken function requires that a token be sent, and adds the corresponding user info to req.user
  // get trip owner from request body (added by requireToken function)
  req.body.trip.owner = req.user.id
  const tripInfo = req.body.trip
  Trip.create(tripInfo)
    .then(trip => res.status(201).json({trip}))
    .catch(next)
})

// show (GET)
router.get('/trips/:id', requireToken, (req, res, next) => {
  const tripId = req.params.id
  Trip.findById(tripId)
    .populate('owner')
    .then(handle404)
    .then(trip => {
      res.status(200).json({trip: trip})
    })
    .catch(next)
})

// destroy (DELETE)
router.delete('/trips/:id', requireToken, (req, res, next) => {
  const tripId = req.params.id
  Trip.findById(tripId)
    .then(handle404)
    .then(trip => {
      requireOwnership(req, trip)

      trip.deleteOne()
    })
    .then(() => res.sendStatus(204))
    .catch(next)
})

// update (PATCH)
router.patch('/trips/:id', requireToken, removeBlanks, (req, res, next) => {
  // if the client attempts to change the `owner` property by including a new owner, prevent that by deleting that key/value pair
  delete req.body.trip.owner

  // get trip id from request parameters and trip info from request body
  const tripId = req.params.id
  const tripInfo = req.body.trip
  Trip.findById(tripId)
    .then(handle404)
    .then(trip => {
      requireOwnership(req, trip)

      trip.set(tripInfo)
      return trip.save()
    })
    .then(() => res.sendStatus(204))
    .catch(next)
})

module.exports = router
