import { Hono } from "hono";
import authRouter from "./routes/auth.route";
import lipaRouter from "./routes/lipa.route";

const app = new Hono().basePath("/v1");
app.get("/", (c) => c.text("Hello Bun!"));

//Routes
app.route("/api/auth", authRouter);
app.route("/api/lipa", lipaRouter);

export default {
  port: Bun.env.PORT,
  fetch: app.fetch,
};
