const snippe_base_url = Bun.env.SNIPPE_BASE_URL;
const snippe_api_key = Bun.env.SNIPPE_API_KEY;

async function initiatePayment(payment: any, phoneNumber: string) {
  const body = JSON.stringify({
    payment_type: "mobile",
    details: {
      amount: payment.amount,
      currency: "TZS",
    },

    phone_number: phoneNumber,

    customer: {
      firstname: "Emmanuel",
      lastname: "Daniel",
      email: "emmanueldanielmaziku@gmail.com",
    },
  });
  const response = await fetch(`${snippe_base_url}/v1/payments`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${snippe_api_key}`,
      "Content-Type": "application/json",
      "Idempotency-Key": crypto.randomUUID(),
    },

    body: body,
  });
  console.log(JSON.parse(body));
  const data = await response.json();
  return { success: true, data: data };
}

export default initiatePayment;
