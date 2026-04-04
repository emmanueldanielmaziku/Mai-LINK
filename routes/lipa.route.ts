import { Hono } from "hono";
import { LipaSchema } from "../validators/lipa.validator";
import lipaService from "../services/lipa.service";
import { json } from "zod";

const lipa = new Hono();

//Add Lipa Number
lipa.post("/", async (c) => {
  const body = await c.req.json();
  const result = LipaSchema.safeParse(body);

  if (!result.success) {
    return c.json(
      {
        status: false,
        errors: result.error.issues.map((issue) => ({
          field: issue.path[0],
          message: issue.message,
        })),
      },
      400,
    );
  }
  const response = await lipaService.addLipa(result.data);
  if (!response.success) {
    return c.json({ status: false, error: response.error }, 409);
  }
  return c.json({ success: true, result: response.data }, 200);
});

//Getting Lipa Number Details
lipa.get("/:lnumber", async (c) => {
  const lnumber = Number(c.req.param("lnumber"));

  const response = await lipaService.getLipa(lnumber);

  if (!response.success) {
    return c.json({ status: false, error: response.error }, 409);
  }

  return c.json({ status: true, data: response.data }, 200);
});

export default lipa;
