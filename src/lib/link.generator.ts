export function generatePaymentCode(): string {
  const chars = "abcdefghijklmnopqrstuvwxyz";
  const link = Bun.env.BASE_URL;
  const rand = (n: number) =>
    Array.from(
      { length: n },
      () => chars[Math.floor(Math.random() * chars.length)],
    ).join("");

  return `${rand(3)}-${rand(4)}-${rand(3)}`;
}
