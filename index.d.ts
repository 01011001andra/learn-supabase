import { JwtPayload } from 'src/auth/guard/auth.guard';

declare module 'express' {
  interface Request {
    user: JwtPayload;
  }
}
