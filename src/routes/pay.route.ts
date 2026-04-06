import { Hono } from "hono";
import { verifyCode } from "../services/pay.service";

const pay = new Hono();

pay.get("/:code", async (c) => {
  const code = c.req.param("code");
  const response = await verifyCode(code);

  if (response?.error) {
    return c.json({
      success: false,
      data: response.error,
    });
  }
  return c.json({
    success: true,
    data: response.data,
  });
});



export default pay;