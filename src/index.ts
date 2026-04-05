import { Hono } from "hono";
import authRouter from "./routes/auth.route";
import payRouter from "./routes/pay.route"
import linkRouter from "./routes/link.route";
import { authMiddleware, AuthVariables } from "./middleware/auth.middleware";

const app = new Hono<{ Variables: AuthVariables }>().basePath("/v1");
app.use("/api/link/*", authMiddleware);
app.use("/pay/*", authMiddleware);

//Routes
app.route("/api/auth", authRouter);
app.route("/api/link", linkRouter);
app.route("/pay", payRouter);

export default {
  port: Bun.env.PORT,
  fetch: app.fetch,
};
