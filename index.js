const http = require("http");
const { allowedNodeEnvironmentFlags } = require("process");

const port = 5000;

let todos = [];

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
      res.statusCode = 201;
      res.end();
    }
  }
  if (items.length === 4) {
    if (req.method === "GET") {
      const requestedId = parseInt(items[3]);
      const requestedTodo = todos.find((todos) => todos.id === requestedId);

      res.statusCode = 200;
      res.end(JSON.stringify(requestedTodo));
    }
    if (req.method === "PATCH") {
      req.on("data", (chunk) => {
        const data = chunk.toString();
        const patchData = JSON.parse(data);
        console.log(patchData.checkmarked);
        todoIndex = todos.findIndex((todo) => todo.id === items[3]);
        todos[todoIndex].checkmarked = patchData.checkmarked;
      });

      res.statusCode = 204;
      res.end();
    }
    if (req.method === "DELETE") {
      todos = todos.filter((todo) => todo.id !== items[3]);

      res.statusCode = 204;
      res.end();
    }
  }
  res.end();
});

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
