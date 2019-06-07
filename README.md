# WCS Points API

The WCS Points API is used to manage WCS members' points and facilitate sign-in for events, office hours, and more.

## Installation

Clone or download this repository, then run:

```
npm install
npm start
```
It will start up on [localhost:3000](localhost:3000). You can then make API calls through an application like [Postman](https://getpostman.com).

## API Calls

There are four routes: `events`, `users`, `events/:id`, `users/:id`. The first two calls are used for getting information about all the events or users that exist in the database. For details about a specific event or user, use the last two calls.

### List all WCS events

```
GET events
```
#### Response

```
{
    "message": "OK",
    "data": [
        {
            "_id": "id_string",
            "name": "event_name",
            "points": 1,
            "__v": 3,
            "key": "event_key",
            "category": "event_category",
            "attendees": [
                "user1",
                "user2"
            ],
            "date": "2018-09-06T00:00:00.000Z",
            "expiration": "2018-09-06T02:00:00.000Z",
            "dateCreated": "2018-09-12T20:32:44.438Z"
        }
}
```
### Create an Event
Make a new Event object in the database. `name`, `points`, `date`, `category`, and `password` must be sent in the request body. Upon submitting the request, the system will generate a random passphrase that will be set as the `key`. An `expiration` will also be automatically set to 2 hours after the event start time.
```
POST events
```
#### Response
```
{
    "message": "Event created!",
    "data": {
        "__v": 0,
        "name": "event_name",
        "points": 1,
        "key": "event_key",
        "category": "event_category",
        "_id": "id_string",
        "attendees": [],
        "expiration": "2018-03-28T07:00:00.000Z",
        "date": "2018-03-28T05:00:00.000Z",
        "dateCreated": "2018-12-11T04:18:45.420Z"
    }
}
```
### Getting data about a specific WCS event
The `:id` parameter must be passed through the API call's url. This is the `id_string` associated with each Event object.
```
GET events/:id
```
#### Response
```
{
    "message": "OK",
    "data": {
        "_id": "id_string",
        "name": "event_name",
        "points": 1,
        "key": "event_key",
        "category": "event_category",
        "__v": 0,
        "attendees": [],
        "expiration": "2018-03-28T07:00:00.000Z",
        "date": "2018-03-28T05:00:00.000Z",
        "dateCreated": "2018-12-11T04:18:45.420Z"
    }
}
```
### Signing into WCS events
The `:id` parameter must be passed through the API call's url. This is the `id_string` associated with each Event object.

`netid` and `event_key` must also be given in the API request body.
```
PUT events/:id
```
#### Response

```
{
    "message": "Successfully signed in!",
    "data": {
        "_id": "id_string",
        "name": "event_name",
        "points": 1,
        "key": "event_key",
        "category": "event_category",
        "__v": 1,
        "attendees": [
            "user1"
        ],
        "expiration": "2018-12-11T06:00:00.000Z",
        "date": "2018-12-11T04:00:00.000Z",
        "dateCreated": "2018-12-11T04:26:50.845Z"
    }
}
```
### List all active WCS members

Active membership (in the API) is considered as anyone who has signed in to an event that school year. The officer password must be sent with the request.

```
GET users
```
#### Response
```
{
    "message": "OK",
    "data": [
        {
            "_id": "id_string",
            "netid": "user1",
            "points": 8,
            "__v": 0,
            "committees": [],
            "office_hours": []
        }
}
```
### Getting data about a specific member
The `:id` parameter must be passed through the API call's url. This is the `netid` associated with each User object.
```
GET users/:id
```
#### Response
```
{
    "message": "OK",
    "data": {
        "points": 3,
        "attended_events": [
            {
                "_id": "id_string",
                "name": "event_name",
                "points": 1,
                "category": "event_category",
                "__v": 42,
                "attendees": [
                    "user1",
                    "user2",
                    "user3"
                ],
                "expiration": "2018-12-11T04:31:53.951Z",
                "date": "2018-10-29T00:00:00.000Z",
                "dateCreated": "2018-10-28T19:07:06.065Z"
            }
        ],
        "committees": [
            "Nov 6, 2018"
        ],
        "office_hours": [
            "Sep 18, 2018",
            "Oct 8, 2018",
            "Nov 6, 2018"
        ]
    }
}
```

### Signing into office hours, committee meetings, etc.
The `:id` parameter must be passed through the API call's url. This is the `netid` associated with each User object.

`type` - office hours or committee meetings - must be given.

```
PUT users/:id
```
#### Response
```
{
    "message": "OK",
    "data": {
        "_id": "id_string",
        "netid": "netid",
        "__v": 2,
        "committees": [
            "Sep 12, 2018"
        ],
        "office_hours": [
            "Oct 5, 2018"
        ]
    }
}
```

## Contact
Feel free to reach out to [contact@illinoiswcs.org](mailto:contact@illinoiswcs.org) with any questions or feedback!
