const http = require("http");
const fs = require("fs");
const { allowedNodeEnvironmentFlags } = require("process");
const { stringify } = require("querystring");

const port = 5000;

let todos = [];

jsonData("get");
function jsonData(getData) {
  fs.readFile("todos.json", (err, data) => {
    if (err) throw err;

    const parsedJson = JSON.parse(data);
    if (getData === "get") {
      todos = parsedJson.jsonTodos;
    } else if (getData === "change") {
      parsedJson.jsonTodos = todos;
      const stringifiedJson = JSON.stringify(parsedJson);
      fs.writeFile("todos.json", stringifiedJson, (err) => {
        if (err) throw err;
        console.log("Wrote to todos.json");
      });
    }
  });
}

const server = http.createServer(async (req, res) => {
  const items = req.url.split("/");
  console.log(`${req.method} to url: ${req.url}`);

  res.setHeader("Content-Type", "application/json");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, HEAD, DELETE, OPTIONS, POST, PUT, PATCH"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers"
  );
  if (req.url === "/api/todos") {
    if (req.method === "GET") {
      console.log("Succeded");
      res.statusCode = 200;
      res.statusMessage = "GET request for all todos succeeded";
      res.end(JSON.stringify(todos));
    }
    if (req.method === "POST") {
      await req.on("data", (chunk) => {
        const data = chunk.toString();
        const newTodo = JSON.parse(data);
        const id = typeof newTodo.id;
        const title = typeof newTodo.title;
        const checkmarked = typeof newTodo.checkmarked;
        const foundTodo = todos.find((todos) => todos.id === newTodo.id);
        const objectLength = Object.keys(newTodo).length;
        if (
          id === "string" &&
          title === "string" &&
          checkmarked === "boolean" &&
          foundTodo?.id !== newTodo.id &&
          objectLength === 3
        ) {
          todos.push(newTodo);
          jsonData("change");
          console.log("Succeded");
          res.statusCode = 201;
          res.statusMessage =
            "POST request for todo succeeded, and is added onto the server";
          res.end();
        } else if (
          foundTodo?.id === newTodo.id &&
          objectLength === 3 &&
          newTodo.id
        ) {
          console.log("Failed");
          res.statusCode = 409;
          res.statusMessage =
            "POST request for todo failed, already exists on the server";
          res.end();
        } else {
          console.log("Failed");
          res.statusCode = 400;
          res.statusMessage = "POST request for todo failed, data not allowed";
          res.end();
        }
      });
    }
  } else if (req.url === `/api/todos/${items[3]}`) {
    if (req.method === "GET") {
      const foundTodo = todos.find((todos) => todos.id === items[3]);
      if (foundTodo) {
        const todoIndex = todos.findIndex((todo) => todo.id === items[3]);
        console.log("Succeded");
        res.statusCode = 200;
        res.statusMessage = "GET request for todo succeeded";
        res.end(JSON.stringify(todos[todoIndex]));
      } else {
        console.log("Failed");
        res.statusCode = 404;
        res.statusMessage =
          "GET request for todo failed, the server can not find the requested resource";
        res.end();
      }
    }
    if (req.method === "PATCH") {
      const foundTodo = todos.find((todos) => todos.id === items[3]);
      if (foundTodo) {
        await req.on("data", (chunk) => {
          const data = chunk.toString();
          const updatedTodo = JSON.parse(data);
          const checkmarked = updatedTodo.checkmarked;
          const objectLength = Object.keys(updatedTodo).length;
          if (checkmarked === false && objectLength === 1) {
            const todoIndex = todos.findIndex((todo) => todo.id === items[3]);
            todos[todoIndex].checkmarked = updatedTodo.checkmarked;
            jsonData("change");
            console.log("Succeded");
            res.statusCode = 204;
            res.statusMessage =
              "PATCH request for todo succeeded, and is updated on the server";
            res.end();
          } else {
            console.log("Failed");
            res.statusCode = 400;
            res.statusMessage =
              "PATCH request for todo failed, data not allowed";
            res.end();
          }
        });
      } else {
        console.log("Failed");
        res.statusCode = 404;
        res.statusMessage =
          "PATCH request for todo failed, the server can not find the requested resource";
        res.end();
      }
    }
    if (req.method === "PUT") {
      const foundTodo = todos.find((todos) => todos.id === items[3]);
      if (foundTodo) {
        await req.on("data", (chunk) => {
          const data = chunk.toString();
          const updatedTodo = JSON.parse(data);
          const id = typeof updatedTodo.id;
          const title = typeof updatedTodo.title;
          const checkmarked = updatedTodo.checkmarked;
          const objectLength = Object.keys(updatedTodo).length;
          if (
            id === "string" &&
            title === "string" &&
            checkmarked === true &&
            objectLength === 3
          ) {
            const todoIndex = todos.findIndex((todo) => todo.id === items[3]);
            todos[todoIndex] = updatedTodo;
            jsonData("change");
            console.log("Succeded");
            res.statusCode = 204;
            res.statusMessage =
              "PUT request for todo succeeded, and is updated on the server";
            res.end();
          } else {
            console.log("Failed");
            res.statusCode = 400;
            res.statusMessage = "PUT request for todo failed, data not allowed";
            res.end();
          }
        });
      } else {
        console.log("Failed");
        res.statusCode = 404;
        res.statusMessage =
          "PUT request for todo failed, the server can not find the requested resource";
        res.end();
      }
    }
    if (req.method === "DELETE") {
      const foundTodo = todos.find((todos) => todos.id === items[3]);
      if (foundTodo) {
        todos = todos.filter((todo) => todo.id !== items[3]);
        jsonData("change");
        console.log("Succeded");
        res.statusCode = 204;
        res.statusMessage =
          "DELETE request for todo succeeded, and is deleted from the server";
        res.end();
      } else {
        console.log("Failed");
        res.statusCode = 404;
        res.statusMessage =
          "DELETE request for todo failed, the server can not find the requested resource";
        res.end();
      }
    }
  } else {
    console.log("Failed");
    res.statusCode = 404;
    res.statusMessage = "The server can not find the requested route";
    res.end();
  }
  res.end();
});

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
