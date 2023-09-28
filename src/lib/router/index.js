/**
 * Router plugin implementation - write your code here
 *
 * This module should export your implementation of Router class.
 */
const { match } = require("path-to-regexp");
class Router {
  constructor() {
    this.router = {};
  }

  get(path, handler) {
    this.registerRoute("GET", path, handler);
    return this;
  }

  post(path, handler) {
    this.registerRoute("POST", path, handler);
    return this;
  }

  put(path, handler) {
    this.registerRoute("PUT", path, handler);
    return this;
  }

  delete(path, handler) {
    this.registerRoute("DELETE", path, handler);
    return this;
  }

  registerRoute(method, path, handler) {
    if (!this.router[method]) {
      this.router[method] = [];
    }
    this.router[method].push({ path, handler });
  }

  routes(options = {}) {
    const { prefix = "" } = options;

    return (req, res, next) => {
      const methodRoutes = this.router[req.method];

      if (!methodRoutes) throw new Error("Method not found.");

      let routeFinded;
      for (const route of methodRoutes) {
        const { path, handler } = route;

        const checkPath = path === "/" ? "" : path;

        const routedMatched = match(prefix + checkPath)(req.url);

        if (routedMatched) {
          const { params } = routedMatched;
          req.params = params;
          routeFinded = handler;
          break;
        }
      }

      if (!routeFinded) throw new Error("Route not found.");

      return routeFinded(req, res, next);
    };
  }
}

module.exports = Router;
