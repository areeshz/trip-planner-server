#!/bin/bash
# 5ef7989028572202a2e2404c owner id for test@test
#TOKEN=12fa72c74507db9dc2489a8c62f05e99 TITLE='My First Vacation' DESTINATION='Hawaii' DURATION=2 DATE='2020/10/10' BUDGET='500' CATEGORY='Beach' STATUS='Planned' sh curl-scripts/trips/create.sh

API="http://localhost:4741"
URL_PATH="/trips"

curl "${API}${URL_PATH}" \
  --include \
  --request POST \
  --header "Content-Type: application/json" \
  --header "Authorization: Bearer ${TOKEN}" \
  --data '{
    "trip": {
      "title": "'"${TITLE}"'",
      "destination": "'"${DESTINATION}"'",
      "duration": "'"${DURATION}"'",
      "date": "'"${DATE}"'",
      "budget": "'"${BUDGET}"'",
      "category": "'"${CATEGORY}"'",
      "status": "'"${STATUS}"'",
      "owner": "'"${OWNER}"'"
    }
  }'

echo
