import { jwt, JwtVariables } from "hono/jwt";

export type AuthVariables = JwtVariables;

export const JWT_SECRET = Bun.env.JWT_SECRET!;
export const JWT_ALG = "HS256" as const;

export const authMiddleware = jwt({
  secret: JWT_SECRET,
  alg: JWT_ALG,
});
