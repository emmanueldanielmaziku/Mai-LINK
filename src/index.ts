import { Hono } from "hono";
import { cors } from "hono/cors";
import authRouter from "./routes/auth.route";
import payRouter from "./routes/pay.route";
import linkRouter from "./routes/link.route";
import lipaRouter from "./routes/lipa.route";
import { authMiddleware, AuthVariables } from "./middleware/auth.middleware";

const app = new Hono<{ Variables: AuthVariables }>();
const root = new Hono();

root.use(
  "*",
  cors({
    origin: [
      "http://localhost:5173",
      "https://mailink.maiescrow.com",
      "https://mai-link-production.up.railway.app",
    ],
    allowMethods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization", "Idempotency-Key"],
  }),
);

app.use("/link/*", authMiddleware);
app.route("/auth", authRouter);
app.route("/link", linkRouter);
app.route("/lipa", lipaRouter);

root.route("/v1/api", app);
root.route("/", payRouter);

export default {
  port: Bun.env.PORT,
  fetch: root.fetch,
};