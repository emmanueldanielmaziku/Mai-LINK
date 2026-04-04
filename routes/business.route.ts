import { Hono } from "hono";
import { BusinessSchema } from "../validators/business.validator";
import addBusiness from "../services/business.service";

const business = new Hono();

business.post("/", async (c) => {
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

  const response = await addBusiness(result.data);

  if (!response.success) {
    return c.json({ success: false, error: response.error }, 409);
  }

  return c.json({ success: true, data: response.data }, 201);
});

export default business;
