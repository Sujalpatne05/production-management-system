export interface JwtPayload {
  sub: string;
  tenant_id?: string;
  role?: string;
  roles?: string[];
  permissions?: string[];
  email?: string;
  [key: string]: unknown;
}
