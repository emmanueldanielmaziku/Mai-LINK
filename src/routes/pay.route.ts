import {Hono} from "hono";

const pay = new Hono();

pay.get("/", async (c) => {
  return c.json({success: true, data: "🚀 Payment Initiated!"});
});

export default pay;