#!/bin/bash

API="http://localhost:4741"
URL_PATH="/trips/${TRIPID}/events/${EVENTID}"

curl "${API}${URL_PATH}" \
  --include \
  --request DELETE \
  --header "Authorization: Token token=${TOKEN}"

echo
