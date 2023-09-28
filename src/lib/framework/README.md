# WebApp Class

The WebApp class is an implementation of a simple web framework in Node.js, designed to create web applications that handle HTTP requests. It provides a mechanism for defining middlewares and executing them sequentially during the processing of an HTTP request.

## Constructor

```javascript
constructor() {
  this.middlewares = [];
}
```

The constructor of the class initializes the middlewares property as an empty array. This property will be used to store the middlewares that will be executed to process HTTP requests.

## `use` Method

```javascript
use(middleware) {
  this.middlewares.push(middleware);
  return this;
}
```

The use method is used to add middlewares to an instance of the WebApp class. It takes a middleware function as an argument and adds it to the middlewares array. The method also returns the instance of the class itself.

## `start` Method

```javascript
start(port) {
  const server = http.createServer((req, res) =>
    this.handleRequest(req, res)
  );

  return server.listen(port);
}
```

The start method is responsible for creating an HTTP server using the Node.js http module. It takes a port number port as an argument and configures the server to call the handleRequest method whenever an HTTP request is received. After configuring the server, it starts the server on the specified port and returns the server object.

## `handleRequest` Method

```javascript
async handleRequest(req, res) {
  try {
    await this.parseRequestBody(req);
    await this.runAllMiddlewares(req, res);

    if (res.body) res.end(JSON.stringify(res.body));
    else res.end();
  } catch (error) {
    this.handleError(error, res);
  }
}
```

The handleRequest method is called whenever an HTTP request is received by the server. It follows these steps:

1. It calls the parseRequestBody method to parse the request body if the request is of type POST or PUT.
2. It calls the runAllMiddlewares method to execute all registered middlewares.
3. If the response object res has a body (res.body), it converts the body into a JSON representation and sends it as a response. Otherwise, it just ends the response.
4. In case of an error during any step of the processing, the handleError method is called to handle the error.

## `parseRequestBody` Method

```javascript
async parseRequestBody(req) {
  // ...
}
```

The parseRequestBody method is used to parse the body of an HTTP request if the request is of type POST or PUT. It is an asynchronous function that returns a promise. The method reads data from the request body as it arrives, concatenates it, and attempts to parse it as JSON. If the JSON is valid, it is assigned to the req.body property of the request. Otherwise, an exception is thrown with the message "Invalid JSON."

## `runAllMiddlewares` Method

```javascript
async runAllMiddlewares(req, res) {
  // ...
}
```

The runAllMiddlewares method is used to execute all registered middlewares in sequence. It is an asynchronous function that uses a recursive structure to ensure the ordered execution of middlewares. Each middleware is called with references to the request (req) and response (res) objects, as well as a next function that allows a middleware to call the next middleware in the queue. This allows middlewares to control the flow of the request.

## `handleError` Method

```javascript
handleError(error, res) {
  if (error.statusCode) {
    res.statusCode = error.statusCode;
  } else {
    res.statusCode = 500;
  }

  console.error(error);
  res.end(error.statusMessage);
}
```

The handleError method is responsible for handling errors that occur during request processing. It sets the response status code based on the error's status code (if it exists) or uses the default 500 (Internal Server Error) status code. Additionally, it logs the error to the console and sends the error message as the response body.
