import { cookies } from "next/headers";

export type UserRole = "ADMIN" | "STAFF" | "EMPLOYEE";

export type AppSession = {
  authUserId: string;
  userId: string;
  email: string;
  name: string;
  role: UserRole;
  avatarUrl: string | null;
};

export async function getSession() {
  const cookieStore = await cookies();
  const raw = cookieStore.get("yeuweb_session")?.value;

  if (!raw) return null;

  try {
    const session = JSON.parse(raw) as AppSession;
    if (!session.userId || !session.email || !session.role) return null;
    return session;
  } catch {
    return null;
  }
}

export function getRoleLabel(role: UserRole) {
  if (role === "ADMIN") return "Admin";
  if (role === "STAFF") return "Staff";
  return "Nhân viên";
}
