# Router Class

The Router class is an implementation of a basic router plugin in Node.js, designed to manage and route HTTP requests to specific handlers based on their HTTP method and path. Let's break down how this class works:

## Constructor

```javascript
constructor() {
  this.router = {};
}
```

The constructor initializes the router property as an empty object. This property will be used to store routes for various HTTP methods (GET, POST, PUT, DELETE).

## HTTP Verb Methods (get, post, put, delete)

```javascript
// get example
get(path, handler) {
  this.registerRoute("GET", path, handler);
  return this;
}
```

The Router class provides methods for registering routes for different HTTP methods (GET, POST, PUT, DELETE). Each of these methods, such as get, post, put, and delete, is responsible for registering a route with a specific HTTP method and associating it with a handler function.

## `registerRoute` Method

```javascript
registerRoute(method, path, handler) {
  if (!this.router[method]) {
    this.router[method] = [];
  }
  this.router[method].push({ path, handler });
}
```

The registerRoute method is used internally to store routes in the router object. It checks if there is an array for the specified HTTP method, creates one if it doesn't exist, and then pushes the route object into that array.

## `routes` Method

```javascript
routes(options = {}) {
  ...
}
```

The routes method is used to create a middleware function that can be used to route incoming HTTP requests to their respective handlers. It takes an optional options object that allows you to specify a prefix for the routes.

Here's how it works:

It first checks if there are any routes registered for the current HTTP method (req.method). If no routes are found for the method, it throws an error.

It iterates through the registered routes for the method and checks if the path of the route matches the requested URL. It uses the path-to-regexp library to perform the matching.

If a matching route is found, it extracts any route parameters and assigns them to req.params. It also stores the associated handler in the routeFound variable.

If no matching route is found, it throws an error indicating that the route was not found.

Finally, it returns the found handler, which can then be executed to handle the request.
