import { Hono } from "hono";
import { LinkSchema } from "../validators/link.validator";
import { AuthVariables } from "../middleware/auth.middleware";
import {
  deleteBusinessLink,
  generateLinkCode,
  listBusinessLinks,
} from "../services/link.service";
import { generatePaymentCode } from "../lib/link.generator";


const link = new Hono<{ Variables: AuthVariables }>();

link.get("/", async (c) => {
  const payload = c.get("jwtPayload");
  const response = await listBusinessLinks(payload.id);

  if (!response.success) {
    return c.json({ success: false, error: response.error }, 409);
  }

  return c.json({ success: true, data: response.data }, 200);
});

link.post("/generate", async (c) => {
  const body = await c.req.json();
  const idempotencyKey = c.req.header("Idempotency-Key");
  const payload = c.get("jwtPayload");

  if (!idempotencyKey) {
    return c.json(
      { success: false, error: "⚠️ Oops! Idempotency-Key header is required" },
      400,
    );
  }

  const result = LinkSchema.safeParse(body);
  if (!result.success) {
    return c.json(
      {
        status: false,
        errors: result.error.issues.map((issue) => ({
          field: issue.path[0],
          message: issue.message,
        })),
      },
      409,
    );
  }

  const code = generatePaymentCode();

  const response = await generateLinkCode(
    result.data.amount,
    payload.id,
    code,
    idempotencyKey,
  );
  if (!response.success) {
    return c.json({ success: false, error: response.error }, 409);
  }
  const payBaseUrl = (Bun.env.PAY_BASE_URL ?? "").replace(/\/$/, "");
  return c.json({
    success: true,
    data: {
      ...response.data,
      code: `${payBaseUrl}/${code}`,
    },
  }, 201);
});

link.delete("/:id", async (c) => {
  const payload = c.get("jwtPayload");
  const id = c.req.param("id");

  const response = await deleteBusinessLink(id, payload.id);
  if (!response.success) {
    return c.json({ success: false, error: response.error }, 404);
  }

  return c.json(
    { success: true, message: "✅ Payment link deleted successfully." },
    200,
  );
});

export default link;