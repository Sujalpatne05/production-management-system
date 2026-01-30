export interface JwtPayload {
  sub: string;
  tenant_id?: string;
  role?: string;
  permissions?: string[];
  email?: string;
  [key: string]: unknown;
}
