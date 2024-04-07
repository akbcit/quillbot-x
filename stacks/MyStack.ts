import { StackContext, Api, StaticSite } from "sst/constructs";

export function API({ stack }: StackContext) {

  const audience = `api-quillbot-${stack.stage}`;

  const api = new Api(stack, "api", {
    authorizers: {
      myAuthorizer: {
        type: "jwt",
        jwt: {
          issuer: "https://quillbotx.kinde.com",
          audience: [audience],
        },
      },
    },
    defaults: {
      authorizer: "myAuthorizer",
      function: {
        environment: {
          DRIZZLE_DATABASE_URL: process.env.DRIZZLE_DATABASE_URL!,
        },
      },
    },
    routes: {
      "GET /": { authorizer: "none", function: { handler: "packages/functions/src/home.handler" } },
      "GET /posts": { authorizer: "myAuthorizer", function: { handler: "packages/functions/src/posts.handler" } },
      "POST /posts": "packages/functions/src/posts.handler",
      "GET /createTextContent": { authorizer: "myAuthorizer", function: { handler: "packages/functions/src/llmRoutes.handler" } },
      "GET /createImage": { authorizer: "myAuthorizer", function: { handler: "packages/functions/src/llmRoutes.handler" } },
    },
  });

  const web = new StaticSite(stack, "web", {
    path: "packages/web",
    buildOutput: "dist",
    buildCommand: "npm run build",
    environment: {
      VITE_APP_API_URL: api.url,
      VITE_APP_KINDE_AUDIENCE: audience,
    },
  });

  stack.addOutputs({
    ApiEndpoint: api.url,
  });
}
