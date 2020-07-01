#!/bin/bash
# 5ef7989028572202a2e2404c owner id for test@test
#TOKEN= TITLE='My First Vacation' DESTINATION='Hawaii' DURATION=2 DATE='Tomorrow' BUDGET='500' CATEGORY='Beach' STATUS='Planned' OWNER=5ef7989028572202a2e2404c sh curl-scripts/trips/create.sh

API="http://localhost:4741"
URL_PATH="/trips/${ID}/events"

curl "${API}${URL_PATH}" \
  --include \
  --request POST \
  --header "Content-Type: application/json" \
  --header "Authorization: Bearer ${TOKEN}" \
  --data '{
    "event": {
      "title": "'"${TITLE}"'",
      "body": "'"${BODY}"'"
    }
  }'

echo
