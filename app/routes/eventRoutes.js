// require needed modules
const express = require('express')
const passport = require('passport')

// require local modules / models
const Trip = require('./../models/trip.js') // mongoose Trip model
const customErrors = require('./../../lib/custom_errors.js')

// we'll use this function to send 404 when non-existant document is requested
const handle404 = customErrors.handle404

// we'll use this function to send 401 when a user tries to modify a resource that's owned by someone else
const requireOwnership = customErrors.requireOwnership

// this is middleware that will remove blank fields from `req.body`, e.g.
// { example: { title: '', text: 'foo' } } -> { example: { text: 'foo' } }
const removeBlanks = require('./../../lib/remove_blank_fields')

// passing this as a second argument to `router.<verb>` will make it
// so that a token MUST be passed for that route to be available
// it will also set `req.user`
const requireToken = passport.authenticate('bearer', { session: false })

// instantiate a router for events
const router = express.Router()

// define routes
// index (GET) is covered because when a trip GET is done, it will return all the events associated with the trip

// create (POST)
router.post('/trips/:tripId/events', requireToken, (req, res, next) => {
  // requireToken function requires that a token be sent, and adds the corresponding user info to req.user
  // get trip owner from request body (added by requireToken function)
  const tripId = req.params.tripId
  const eventInfo = req.body.event
  Trip.findById(tripId)
    .then(handle404)
    .then(trip => {
      requireOwnership(req, trip)

      trip.events.push(eventInfo)
      return trip.save()
    })
    .then(() => res.sendStatus(204))
    .catch(next)
})

// show (GET)
router.get('/trips/:tripId/events/:eventId', requireToken, (req, res, next) => {
  const tripId = req.params.tripId
  const eventId = req.params.eventId
  Trip.findById(tripId)
    .then(handle404)
    .then(trip => {
      // find the specific event
      let event = trip.events.id(eventId)
      // handle404 if the event does not exist
      event = handle404(event)
      res.status(200).json({event: event})
    })
    .catch(next)
})

// update (PATCH)
router.patch('/trips/:tripId/events/:eventId', requireToken, removeBlanks, (req, res, next) => {
  const tripId = req.params.tripId
  const eventId = req.params.eventId
  const eventInfo = req.body.event
  Trip.findById(tripId)
    .then(handle404)
    .then(trip => {
      requireOwnership(req, trip)
      // find the specific event
      let event = trip.events.id(eventId)
      // handle404 if the event does not exist
      event = handle404(event)
      // update the event data
      Object.assign(event, eventInfo)
      // save the TRIP so the new event data sticks
      return trip.save()
    })
    .then((trip) => res.sendStatus(204))
    .catch(next)
})

// destroy (DELETE)
router.delete('/trips/:tripId/events/:eventId', requireToken, (req, res, next) => {
  const tripId = req.params.tripId
  const eventId = req.params.eventId
  Trip.findById(tripId)
    .then(handle404)
    .then(trip => {
      requireOwnership(req, trip)
      // find the specific event
      let event = trip.events.id(eventId)
      // make sure the event exists
      event = handle404(event)
      // remove the event
      event.remove()
      // save the trip so the event removal sticks
      return trip.save()
    })
    .then(() => res.sendStatus(204))
    .catch(next)
})

module.exports = router
