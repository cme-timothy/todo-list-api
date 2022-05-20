const http = require("http");
const fs = require("fs");
const { allowedNodeEnvironmentFlags } = require("process");

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

const server = http.createServer((req, res) => {
  const items = req.url.split("/");
  console.log(items);
  console.log(items.length);
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
      res.statusCode = 200;
      res.end(JSON.stringify(todos));
    }
    if (req.method === "POST") {
      req.on("data", (chunk) => {
        const data = chunk.toString();
        const newTodo = JSON.parse(data);
        todos.push(newTodo);
      });
      jsonData("change");
      res.statusCode = 201;
      res.end();
    }
  } else if (req.url === `/api/todos/${items[3]}`) {
    if (req.method === "GET") {
      const foundTodo = todos.find((todos) => todos.id === items[3]);
      if (foundTodo) {
        res.statusCode = 200;
        res.end(JSON.stringify(requestedTodo));
      } else {
        res.statusCode = 404;
        console.log("Not Found");
        res.end();
      }
    }
    if (req.method === "PATCH") {
      const foundTodo = todos.find((todos) => todos.id === items[3]);
      if (foundTodo) {
        req.on("data", (chunk) => {
          const data = chunk.toString();
          const patchData = JSON.parse(data);
          console.log(patchData.checkmarked);
          todoIndex = todos.findIndex((todo) => todo.id === items[3]);
          todos[todoIndex].checkmarked = patchData.checkmarked;
        });
        jsonData("change");
        res.statusCode = 204;
        res.end();
      } else {
        res.statusCode = 404;
        console.log("Not Found");
        res.end();
      }
    }
    if (req.method === "PUT") {
      const foundTodo = todos.find((todos) => todos.id === items[3]);
      if (foundTodo) {
        req.on("data", (chunk) => {
          const data = chunk.toString();
          const updatedData = JSON.parse(data);
          console.log(updatedData);
          todoIndex = todos.findIndex((todo) => todo.id === items[3]);
          todos[todoIndex] = updatedData;
        });
        jsonData("change");
        res.statusCode = 204;
        res.end();
      } else {
        res.statusCode = 404;
        console.log("Not Found");
        res.end();
      }
    }
    if (req.method === "DELETE") {
      const foundTodo = todos.find((todos) => todos.id === items[3]);
      if (foundTodo) {
        todos = todos.filter((todo) => todo.id !== items[3]);
        jsonData("change");
        res.statusCode = 204;
        res.end();
      } else {
        res.statusCode = 404;
        console.log("Not Found");
        res.end();
      }
    }
  } else {
    res.statusCode = 404;
    console.log("Not Found");
    res.end();
  }
  res.end();
});

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
