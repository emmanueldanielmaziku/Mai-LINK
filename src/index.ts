import { Hono } from "hono";
import authRouter from "./routes/auth.route";
import payRouter from "./routes/pay.route";
import linkRouter from "./routes/link.route";
import { authMiddleware, AuthVariables } from "./middleware/auth.middleware";

const app = new Hono<{ Variables: AuthVariables }>();
const root = new Hono();

app.use("/link/*", authMiddleware);
app.route("/auth", authRouter);
app.route("/link", linkRouter);

root.route("/v1/api", app);
root.route("/", payRouter);

export default {
  port: Bun.env.PORT,
  fetch: root.fetch,
};
