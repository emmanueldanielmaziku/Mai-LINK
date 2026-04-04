import { Hono } from "hono";
import { BusinessSchema } from "../validators/business.validator";
import auth from "../services/auth.service";
import { AuthSchema } from "../validators/auth.validator";
import { authMiddleware, AuthVariables, JWT_ALG, JWT_SECRET } from "../middleware/auth.middleware";
import { sign } from "hono/jwt";

const business = new Hono<{ Variables: AuthVariables }>();

business.post("/signup", async (c) => {
  const body = await c.req.json();
  const result = BusinessSchema.safeParse(body);

  if (!result.success) {
    return c.json(
      {
        success: false,
        errors: result.error.issues.map((issue) => ({
          field: issue.path[0],
          message: issue.message,
        })),
      },
      400,
    );
  }

  const response = await auth.signUp(result.data);

  if (!response.success) {
    return c.json({ success: false, error: response.error }, 409);
  }

  const payload = {
    id: response.data?.id,
    business_number: response.data?.businessNumber,
    exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24,
  };

  const token = await sign(payload, JWT_SECRET, JWT_ALG);

  return c.json({ success: true, data: response.data, token }, 201);
});


//Signin
business.post("/signin", async (c) => {
  const body = await c.req.json();
  const result = AuthSchema.safeParse(body);

  if (!result.success) {
    return c.json(
      {
        success: false,
        errors: result.error.issues.map((issue) => ({
          field: issue.path[0],
          message: issue.message,
        })),
      },
      400,
    );
  }

  const response = await auth.signIn(result.data);

  if (!response.success) {
    return c.json({ success: false, error: response.error }, 409);
  }

  

  return c.json({ success: true, data: response.data }, 201);
});
export default business;
