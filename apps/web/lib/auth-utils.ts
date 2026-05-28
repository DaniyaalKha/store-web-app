export type AuthUser = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: "customer" | "admin";
  address?: string | null;
  city?: string | null;
  state?: string | null;
  country?: string | null;
};
