# To-do list API

This is a simple to-do list API for my first node.js web server assignment.

## Pre-requisites

In order to start this web server you will need to install:

- [Node.js](https://nodejs.org/en/)

## How to start the web server

Type in the following command;

```
node index.js
```

# API route list

- http://localhost:5000/api/todos
- http://localhost:5000/api/todos/id

# Klient side request examples

The web server is created for this [to-do list](https://github.com/cme-timothy/todo-list-klient).

## Get all todos

```
axios.get("http://localhost:5000/api/todos")
      .then(function (response) {
        console.log(response.data);
      })
```

Output example:

```
[
    {
        id: '5CjpiZDd_1G8jhcqVS6t',
        title: 'do the dishes',
        checkmarked: false
    },
    {
        id: '5fRpHGtQB8uqcv1TIfMZ3',
        title: 'clean the bedroom',
        checkmarked: true
    }
]
```

If request succeded then you will recieve status code 200 with status message: GET request for all todos succeeded

## get a single todo

A unique identifier string:
id: '5CjpiZDd_1G8jhcqVS6t'

```
axios.get("http://localhost:5000/api/todos/5CjpiZDd_1G8jhcqVS6t")
      .then(function (response) {
        console.log(response.data);
      })
```

Output example:

```
[
    {
        id: '5CjpiZDd_1G8jhcqVS6t',
        title: 'do the dishes',
        checkmarked: false
    }
]
```

If request succeded then you will recieve status code 200 with status message: GET request for todo succeeded

## Add new todo

A unique identifier string:
id: '5CjpiZDd_1G8jhcqVS6t'

```
axios.post("http://localhost:5000/api/todos",
    {
        id: '5CjpiZDd_1G8jhcqVS6t',
        title: 'do the dishes',
        checkmarked: false
    })
```

If request succeded then you will recieve status code 201 with status message: POST request for todo succeeded, and is added onto the server

## Toggle checkmark of todo to off

A unique identifier string:
id: '5CjpiZDd_1G8jhcqVS6t'

```
axios.patch("http://localhost:5000/api/todos/5CjpiZDd_1G8jhcqVS6t",
    {
        checkmarked: false,
    })
```

If request succeded then you will recieve status code 204 with status message: PATCH request for todo succeeded, and is updated on the server

## Toggle checkmark of todo to on

A unique identifier string:
id: '5CjpiZDd_1G8jhcqVS6t'

```
axios.put("http://localhost:5000/api/todos/5CjpiZDd_1G8jhcqVS6t",
    {
        id: '5CjpiZDd_1G8jhcqVS6t',
        title: 'do the dishes',
        checkmarked: true
    })
```

If request succeded then you will recieve status code 204 with status message: PUT request for todo succeeded, and is updated on the server

## Delete todo

A unique identifier string:
id: '5CjpiZDd_1G8jhcqVS6t'

```
axios.delete("http://localhost:5000/api/todos/5CjpiZDd_1G8jhcqVS6t")
```

If request succeded then you will recieve status code 204 with status message: DELETE request for todo succeeded, and is deleted from the server
