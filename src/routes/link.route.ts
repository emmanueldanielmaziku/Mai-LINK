import { Hono } from "hono";
import { LinkSchema } from "../validators/link.validator";
import { AuthVariables } from "../middleware/auth.middleware";
import { generateLink } from "../services/link.service";
import { generatePaymentLink } from "../lib/code";


const link = new Hono<{ Variables: AuthVariables }>();

link.post("/generate", async (c) => {
  const body = await c.req.json();
  const idempotencyKey = c.req.header("Idempotency-Key");
  const payload = c.get("jwtPayload");

  if (!idempotencyKey) {
    return c.json(
      { success: false, error: "⚠️ Oops! Idempotency-Key header is required" },
      400,
    );
  } else {

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

  const link = generatePaymentLink();

  const response = await generateLink(
    result.data.amount,
    payload.id,
    link,
    idempotencyKey,
  );
  if (!response.success) {
    return c.json({ success: false, error: response.error }, 409);
  }
  return c.json({ success: true, data: response.data }, 201);
});

export default link;
