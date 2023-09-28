/**
 * Web framework implementation - write your code here
 *
 * This module should export your implementation of WebApp class.
 */
const http = require("http");

class WebApp {
  constructor() {
    this.middlewares = [];
  }

  use(middleware) {
    this.middlewares.push(middleware);
    return this;
  }

  start(port) {
    const server = http.createServer((req, res) =>
      this.handleRequest(req, res)
    );

    return server.listen(port);
  }

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

  async parseRequestBody(req) {
    return new Promise((resolve, reject) => {
      if (req.method === "POST" || req.method === "PUT") {
        let body = "";

        req.on("data", (chunk) => {
          body += chunk.toString();
        });

        req.on("end", () => {
          try {
            req.body = JSON.parse(body);
            resolve();
          } catch (error) {
            reject(new Error("Invalid JSON."));
          }
        });
      } else {
        resolve();
      }
    });
  }

  async runAllMiddlewares(req, res) {
    await new Promise((resolve, reject) => {
      const runMiddleware = async (index) => {
        if (index < this.middlewares.length) {
          const middleware = this.middlewares[index];
          try {
            await middleware(req, res, async () =>
              resolve(await runMiddleware(index + 1))
            );
          } catch (error) {
            reject(error);
          }
        }
      };

      runMiddleware(0);
    });
  }

  handleError(error, res) {
    if (error.statusCode) {
      res.statusCode = error.statusCode;
    } else {
      res.statusCode = 500;
    }

    console.error(error);
    res.end(error.statusMessage);
  }
}

module.exports = WebApp;
