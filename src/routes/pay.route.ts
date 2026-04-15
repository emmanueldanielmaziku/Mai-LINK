import { Hono } from "hono";
import { payByCode, verifyCode } from "../services/pay.service";

const pay = new Hono();

function renderPayPage(code: string, message?: string) {
  const escapedCode = code.replace(/"/g, "&quot;");
  const escapedMessage = (message ?? "").replace(/</g, "&lt;").replace(/>/g, "&gt;");

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <title>Mai-LINK Payment</title>
    <style>
      body { font-family: Inter, sans-serif; background: #0a0a0f; color: #fafafa; margin: 0; padding: 24px; }
      .card { max-width: 420px; margin: 40px auto; background: #12121a; border: 1px solid rgba(255,255,255,.1); border-radius: 12px; padding: 20px; }
      .title { font-size: 24px; margin-bottom: 4px; }
      .muted { color: #a1a1aa; font-size: 14px; margin-bottom: 16px; }
      .input { width: 100%; box-sizing: border-box; height: 44px; border-radius: 8px; border: 1px solid rgba(255,255,255,.15); background: #1a1a24; color: #fafafa; padding: 0 12px; margin-bottom: 12px; }
      .button { width: 100%; height: 44px; border: none; border-radius: 8px; background: #10b981; color: #022c22; font-weight: 700; cursor: pointer; }
      .msg { margin-top: 12px; color: #fca5a5; font-size: 14px; min-height: 20px; }
    </style>
  </head>
  <body>
    <div class="card">
      <div class="title">Complete Payment</div>
      <div class="muted">Enter your phone number to pay.</div>
      <input id="phone" class="input" placeholder="e.g. 255758376759" />
      <button id="payBtn" class="button">Pay</button>
      <div id="msg" class="msg">${escapedMessage}</div>
    </div>
    <script>
      const code = "${escapedCode}";
      const phoneInput = document.getElementById("phone");
      const payBtn = document.getElementById("payBtn");
      const msg = document.getElementById("msg");

      payBtn.addEventListener("click", async () => {
        msg.textContent = "";
        const phone_number = phoneInput.value.trim();
        if (!phone_number) {
          msg.textContent = "Phone number is required.";
          return;
        }
        payBtn.disabled = true;
        payBtn.textContent = "Processing...";
        try {
          const res = await fetch("/pay/" + code, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ phone_number })
          });
          const data = await res.json();
          if (!res.ok || !data.success) {
            msg.textContent = data.error || data.data || "Payment failed.";
            return;
          }
          msg.style.color = "#86efac";
          msg.textContent = "Payment initiated successfully.";
        } catch (error) {
          msg.textContent = "Failed to connect. Please try again.";
        } finally {
          payBtn.disabled = false;
          payBtn.textContent = "Pay";
        }
      });
    </script>
  </body>
</html>`;
}

pay.get("/pay/:code", async (c) => {
  const code = c.req.param("code");
  const response = await verifyCode(code);

  if (!response.success) {
    return c.html(renderPayPage(code, response.error), 200);
  }

  return c.html(renderPayPage(code), 200);
});

pay.post("/pay/:code", async (c) => {
  const code = c.req.param("code");
  const body = await c.req.json().catch(() => null);
  const phoneNumber = body?.phone_number;

  if (!phoneNumber || typeof phoneNumber !== "string") {
    return c.json({ success: false, error: "⚠️ Phone number is required." }, 400);
  }

  const response = await payByCode(code, phoneNumber);

  if (!response.success) {
    return c.json({ success: false, error: response.error }, 400);
  }

  return c.json({
    success: true,
    data: response.data,
  });
});

// Backward-compatible POST endpoint for /:code.
pay.post("/:code", async (c) => {
  const code = c.req.param("code");
  const body = await c.req.json().catch(() => null);
  const phoneNumber = body?.phone_number;

  if (!phoneNumber || typeof phoneNumber !== "string") {
    return c.json({ success: false, error: "⚠️ Phone number is required." }, 400);
  }

  const response = await payByCode(code, phoneNumber);
  if (!response.success) {
    return c.json({ success: false, error: response.error }, 400);
  }

  return c.json({ success: true, data: response.data });
});

// Backward-compatible endpoint if old links exist without /pay/.
pay.get("/:code", async (c) => {
  const code = c.req.param("code");
  return c.redirect(`/pay/${code}`);
});



export default pay;