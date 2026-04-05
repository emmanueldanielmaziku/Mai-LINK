import { Hono } from "hono";
import authRouter from "./routes/auth.route";
import lipaRouter from "./routes/lipa.route";
import linkRouter from "./routes/link.route";
import { authMiddleware, AuthVariables } from "./middleware/auth.middleware";

const app = new Hono<{ Variables: AuthVariables }>().basePath("/v1");
app.use("/api/link/*", authMiddleware);

//Routes
app.route("/api/auth", authRouter);
app.route("/api/lipa", lipaRouter);
app.route("/api/link", linkRouter);

export default {
  port: Bun.env.PORT,
  fetch: app.fetch,
};
