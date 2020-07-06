# Trip Planner Server

The Trip Planner Server is an API created in Node and Express that utilizes MongoDB to store and retrieve trip data logged by users of the Trip Planner Client Application. It also allows users to register for accounts on the application.

## Links
- API URL: [https://areeshz-trip-planner.herokuapp.com/](https://areeshz-trip-planner.herokuapp.com/)
- Client Application: [https://areeshz.github.io/trip-planner-client/](https://areeshz.github.io/trip-planner-client/)
- Front-End Repository: [https://github.com/areeshz/trip-planner-client](https://github.com/areeshz/trip-planner-client)

## Technologies Used

- Node.js
- Express.js
- MongoDB
- Mongoose

## Entity Relationship Diagram

![IMG_5370](https://user-images.githubusercontent.com/64225299/86543376-e19d5d00-beeb-11ea-97cc-cb23b33b64be.jpg)

## API End Points

| Verb   | URI Pattern               | Controller#Action |
|--------|---------------------------|-------------------|
| POST   | `/sign-up`                | `users#signup`    |
| POST   | `/sign-in`                | `users#signin`    |
| DELETE | `/sign-out`               | `users#signout`   |
| PATCH  | `/change-password`        | `users#changepw`  |
| GET    | `/trips`                  | `trips#index`     |
| POST   | `/trips`                  | `trips#create`    |
| GET    | `/trips/:id`              | `trips#show`      |
| PATCH  | `/trips/:id`              | `trips#update`    |
| DELETE | `/trips/:id`              | `trips#destroy`   |
| POST   | `/trips/:tripId/events`   | `events#create`   |
| GET    | `/trips/:tripId/events/:eventId` | `events#show` |
| PATCH | `/trips/:tripId/events/:eventId` | `events#update` |
| DELETE | `/trips/:tripId/events/:eventId` | `event#destroy` |

All data returned from API actions is formatted as JSON.

## User Actions

*Summary:*

<table>
<tr>
  <th colspan="4">Request</th>
  <th colspan="2">Response</th>
</tr>
<tr>
  <th>Verb</th>
  <th>URI</th>
  <th>body</th>
  <th>Headers</th>
  <th>Status</th>
  <th>body</th>
</tr>
<tr>
<td>POST</td>
<td>`/sign-up`</td>
<td><strong>credentials</strong></td>
<td>empty</td>
<td>201, Created</td>
<td><strong>user</strong></td>
</tr>
<tr>
  <td colspan="4"></td>
  <td>400 Bad Request</td>
  <td><em>empty</em></td>
</tr>
<tr>
<td>POST</td>
<td>`/sign-in`</td>
<td><strong>credentials</strong></td>
<td>empty</td>
<td>200 OK</td>
<td><strong>user w/token</strong></td>
</tr>
<tr>
  <td colspan="4"></td>
  <td>401 Unauthorized</td>
  <td><strong>errors</strong></td>
</tr>
<tr>
<td>DELETE</td>
<td>`/sign-out`</td>
<td>empty</td>
<td><strong>token</strong></td>
<td>201 Created</td>
<td>empty</td>
</tr>
<tr>
  <td colspan="4"></td>
  <td>401 Unauthorized</td>
  <td><strong>errors</strong></td>
</tr>
<tr>
<td>PATCH</td>
<td>`/change-password`</td>
<td><strong>passwords</strong></td>
<td><strong>token</strong></td>
<td>204 No Content</td>
<td><strong>user w/token</strong></td>
</tr>
<tr>
  <td colspan="4"></td>
  <td>400 Bad Request</td>
  <td><em>empty</em></td>
</tr>
</table>

### signup

The `create` action expects a *POST* of `credentials` identifying a new user to create, e.g.:

```json
{
  "credentials": {
    "email": "an@example.email",
    "password": "an example password",
    "password_confirmation": "an example password"
  }
}
```


If the request is successful, the response will have an HTTP Status of 201,
Created, and the body will be JSON containing the `id` and `email` of the new
user, e.g.:

```json
{
  "user": {
    "_id":"an example id",
    "email":"an@example.com",
    "createdAt":"an example date",
    "updatedAt":"an example date",
    "__v":0
  }
}
```

If the request is unsuccessful, the response will have an HTTP Status of 400 Bad
Request, and the response body will be empty.

### signin

The `signin` action expects a *POST* with `credentials` identifying a previously registered user, e.g.:

```json
{
  "credentials": {
    "email": "an@example.email",
    "password": "an example password"
  }
}
```

If the request is successful, the response will have an HTTP Status of 200 OK,
and the body will be JSON containing the user's `id`, `email`, and the `token`
used to authenticate other requests, e.g.:

```json
{
  "user":{
    "_id":"an example id",
    "email":"an@example.com",
    "createdAt":"an example date",
    "updatedAt":"an example date",
    "__v":0,
    "token":"<token>"
  }
}
```

If the request is unsuccessful, the response will have an HTTP Status of 401
Unauthorized, and the response body will include the error.

### signout

The `signout` action expects a *DELETE* request and must include the user's
token but no data is necessary to be sent.

If the request is successful the response will have an HTTP status of 204 No
Content.

If the request is unsuccessful, the response will have a status of 401
Unauthorized.

### changepw

The `changepw` action expects a PATCH of `passwords` specifying the `old` and `new`, eg.:

```json
{
  "passwords": {
    "old": "example password",
    "new": "new example password"
  }
}
```

If the request is successful the response will have an HTTP status of 204 No
Content.

If the request is unsuccessful the reponse will have an HTTP status of 400 Bad
Request.

---

The `sign-out` and `change-password` requests must include a valid HTTP header
`Authorization: Token token=<token>` or they will be rejected with a status of
401 Unauthorized.

## Trip Actions

All trip action requests must include a valid HTTP header `Authorization:
Token token=<token>` or they will be rejected with a status of 401 Unauthorized.

All of the trip actions follow the _RESTful_ style.

Trips are owned by users. Actions will only retrieve a trip if the user associated with the `Authorization` header matches the owner's token, which is generated on sign in and deleted on sign out. If this requirement is unmet,
the response will be 401 Unauthorized.

*Summary:*

<table>
<tr>
  <th colspan="3">Request</th>
  <th colspan="2">Response</th>
</tr>
<tr>
  <th>Verb</th>
  <th>URI</th>
  <th>body</th>
  <th>Status</th>
  <th>body</th>
</tr>
<tr>
<td>GET</td>
<td>`/trips`</td>
<td>n/a</td>
<td>200, OK</td>
<td><strong>trips found</strong></td>
</tr>
<tr>
  <td colspan="3">
  </td>
  <td>200, OK</td>
  <td><em>empty trips</em></td>
</tr>
<tr>
  <td colspan="3">
  The default is to retrieve all trips associated with the user..
  </td>
  <td>401 Unauthorized</td>
  <td><strong>errors</strong></td>
</tr>
<tr>
<td>POST</td>
<td>`/trips`</td>
<td><strong>trip</strong></td>
<td>201, Created</td>
<td><strong>trip created</strong></td>
</tr>
<tr>
  <td colspan="3">
  </td>
  <td>401 Unauthorized</td>
  <td><strong>errors</strong></td>
</tr>
<tr>
  <td colspan="3">
  </td>
  <td>400 Bad Request</td>
  <td><strong>errors</strong></td>
</tr>
<tr>
<td>GET</td>
<td>`/trips/:id`</td>
<td>n/a</td>
<td>200, OK</td>
<td><strong>trip found</strong</td>
</tr>
<tr>
  <td colspan="3">
  </td>
  <td>401 Unauthorized</td>
  <td><strong>errors</strong></td>
</tr>
<tr>
  <td colspan="3">
  </td>
  <td>404 Not Found</td>
  <td><em>empty</em></td>
</tr>
<tr>
<td>PATCH</td>
<td>`/trips/:id`</td>
<td><strong>trip delta</strong></td>
<td>204, No Content</td>
<td><strong>empty</strong></td>
</tr>
<tr>
  <td colspan="3"></td>
  <td>400 Bad Request</td>
  <td><strong>errors</strong></td>
</tr>
<tr>
  <td colspan="3"></td>
  <td>404 Not Found</td>
  <td><em>empty</em></td>
</tr>
<td>DELETE</td>
<td>`/trips/:id`</td>
<td> n/a</td>
<td>204, No Content</td>
<td><strong>empty</strong></td>
</tr>
<tr>
  <td colspan="3"></td>
  <td>400 Bad Request</td>
  <td><strong>errors</strong></td>
</tr>
<tr>
  <td colspan="3"></td>
  <td>404 Not Found</td>
  <td><em>errors</em></td>
</tr>
</table>

### index
The `index` action is a _GET_ that retrieves all the trips associated with a user. The response body will contain JSON containing an array of trips, e.g:
```JSON
{
  "trips": [
    {
      "_id": "an example trip id",
      "title": "My First Trip",
      "category": "Beach",
      "status": "Past Trip",
      "destination": "Atlanta",
      "date": "2020-05-06",
      "duration": 2,
      "budget": 300,
      "owner": {
        "_id": "an example owner id",
        "email": "example@email",
        "createdAt": "2020-07-02T22:26:12.759Z",
        "updatedAt": "2020-07-06T03:11:23.503Z",
        "__v": 0,
        "token": "an example authentication token"
      },
      "events": [],
      "createdAt": "2020-07-06T03:10:25.381Z",
      "updatedAt": "2020-07-06T03:10:25.381Z",
      "__v": 0
    },
    {
      "_id": "an example trip id",
      "title": "My Second Trip",
      "category": "Roadtrip",
      "status": "Planned Trip",
      "destination": "Chicago",
      "date": "2020-10-21",
      "duration": 4,
      "budget": 600,
      "owner": {
        "_id": "an example owner id",
        "email": "example@email",
        "createdAt": "2020-07-02T22:26:12.759Z",
        "updatedAt": "2020-07-06T03:11:23.503Z",
        "__v": 0,
        "token": "an example authentication token"
      },
      "events": [],
      "createdAt": "2020-07-06T03:10:52.876Z",
      "updatedAt": "2020-07-06T03:10:52.876Z",
      "__v": 0
    }
  ]
}
```
If the request is unsuccessful, the response will have an HTTP Status of 400 Bad Request, and the response body will be JSON describing the errors.

### create
The `create` action expects a POST with a body containing trip details in JSON format. If the request is successful, the response will have an HTTP Status of 201 Created, and the body will contain JSON of the created trip with `owner` set to the user calling `create`, e.g.:

```json
{
  "trip": {
    "_id": "an example trip id",
    "title": "My First Vacation",
    "destination": "Hawaii",
    "duration": 2,
    "date": "2020/10/10",
    "budget": 500,
    "category": "Beach",
    "status": "Planned",
    "owner": "an example owner id",
    "events": [],
    "createdAt": "2020-07-06T03:18:44.774Z",
    "updatedAt": "2020-07-06T03:18:44.774Z",
    "__v": 0
  }
}
```

### show
The `show` action is a GET specifying the `id` of the trip to retrieve. If the request is successful, the status will be 200, OK, and the response body will contain JSON for the trip requested, e.g.:
```json
{
  "trip": {
    "_id": "an example trip id",
    "title": "My First Vacation",
    "destination": "Hawaii",
    "duration": 2,
    "date": "2020/10/10",
    "budget": 500,
    "category": "Beach",
    "status": "Planned",
    "owner": "an example owner id",
    "events": [],
    "createdAt": "2020-07-06T03:18:44.774Z",
    "updatedAt": "2020-07-06T03:18:44.774Z",
    "__v": 0
  }
}
```

### update
### update a trip's state
This `update` expects a _PATCH_ request with changes to an existing trip, formatted as such:
```json
{
  "trip": {
    "title": "My First Vacation",
    "destination": "Hawaii",
    "duration": 2,
    "date": "2020/10/10",
    "budget": 500,
    "category": "Beach",
    "status": "Planned"
  }
}
```

If the request is successful, the response will have an HTTP Status of 204, No Content, and the body will be empty.

If the request is unsuccessful, the response will have an HTTP Status of 400 Bad Request, and the body will be JSON describing the errors.

### destroy
The `destroy` action is a _DELETE_ specifying the `id` of the trip to delete. If the request is successful the status will be 204, No Content, and the body will be empty.

## Event Actions

All event action requests must include a valid HTTP header `Authorization: Token token=<token>` or they will be rejected with a status of 401 Unauthorized.

All of the event actions follow the _RESTful_ style.

Summary:

<table>
<tr>
  <th colspan="3">Request</th>
  <th colspan="2">Response</th>
</tr>
<tr>
  <th>Verb</th>
  <th>URI</th>
  <th>body</th>
  <th>Status</th>
  <th>body</th>
</tr>
<tr>
<td>POST</td>
<td>`/trips/:tripId/events`</td>
<td><strong>event</strong></td>
<td>204, No Content</td>
<td><strong>empty</strong></td>
</tr>
<tr>
  <td colspan="3">
  </td>
  <td>401 Unauthorized</td>
  <td><strong>errors</strong></td>
</tr>
<tr>
  <td colspan="3">
  </td>
  <td>400 Bad Request</td>
  <td><strong>errors</strong></td>
</tr>
<tr>
<td>GET</td>
<td>`/trips/:tripId/events/:eventId`</td>
<td>n/a</td>
<td>200, OK</td>
<td><strong>event found</strong</td>
</tr>
<tr>
  <td colspan="3">
  </td>
  <td>401 Unauthorized</td>
  <td><strong>errors</strong></td>
</tr>
<tr>
  <td colspan="3">
  </td>
  <td>404 Not Found</td>
  <td><em>empty</em></td>
</tr>
<tr>
<td>PATCH</td>
<td>`/trips/:tripId/events/:eventId`</td>
<td><strong>event delta</strong></td>
<td>204, No Content</td>
<td><strong>empty</strong></td>
</tr>
<tr>
  <td colspan="3"></td>
  <td>400 Bad Request</td>
  <td><strong>errors</strong></td>
</tr>
<tr>
  <td colspan="3"></td>
  <td>404 Not Found</td>
  <td><em>empty</em></td>
</tr>
<td>DELETE</td>
<td>`/trips/:id`</td>
<td> n/a</td>
<td>204, No Content</td>
<td><strong>empty</strong></td>
</tr>
<tr>
  <td colspan="3"></td>
  <td>400 Bad Request</td>
  <td><strong>errors</strong></td>
</tr>
<tr>
  <td colspan="3"></td>
  <td>404 Not Found</td>
  <td><em>errors</em></td>
</tr>
</table>

### create

The `create` action expects a _POST_ with a body containing event details in JSON format. If the request is successful, the response will have an HTTP Status of 204 Created, and the body will be empty.

### show
The `show` action expects a _GET_ specifying both the ID of the event to retrieve and the ID of the trip to which it belongs. If the request is successful, the response will have an HTTP Status of 200 OK, and the response body will contain JSON for the event retrieved, e.g:

```json
{
  "event": {
    "_id": "an example event id",
    "title": "Some Title",
    "body": "Some Description",
    "createdAt": "2020-07-06T03:48:28.695Z",
    "updatedAt": "2020-07-06T03:48:28.695Z"
  }
}
```

### update

This `update` expects a _PATCH_ request with a body containing changes to an existing event, formatted as such:

```json
{
	"event": {
		"title": "New Event Title",
		"body": "New Event Description"
	}
}
```

If the request is successful, the response will have an HTTP Status of 204, No Content, and the body will be empty.

If the request is unsuccessful, the response will have an HTTP Status of 400 Bad Request, and the body will be JSON describing the errors.

### destroy

The `destroy` action is a _DELETE_ specifying the `id` of the event to delete and the `id` of the trip to which it belongs. If the request is successful the status will be 204, No Content, and the body will be empty.
