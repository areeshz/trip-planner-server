#!/bin/bash
# 5ef7989028572202a2e2404c owner id for test@test
#TOKEN= ID= TITLE='My First Vacation' DESTINATION='Hawaii' DURATION=2 DATE='Tomorrow' BUDGET='500' CATEGORY='Beach' STATUS='Planned' sh curl-scripts/trips/update.sh

API="http://localhost:4741"
URL_PATH="/trips/${TRIPID}/events/${EVENTID}"

curl "${API}${URL_PATH}" \
  --include \
  --request PATCH \
  --header "Content-Type: application/json" \
  --header "Authorization: Token token=${TOKEN}" \
  --data '{
    "event": {
      "title": "'"${TITLE}"'",
      "body": "'"${BODY}"'"
    }
  }'

echo
