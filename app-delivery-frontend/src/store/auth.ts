import type { User } from "../services/auth";

const KEY = "delivery:user";

export function saveUser(user: User) {
  localStorage.setItem(KEY, JSON.stringify(user));
}
export function getUser(): User | null {
  const raw = localStorage.getItem(KEY);
  return raw ? JSON.parse(raw) : null;
}
export function clearUser() {
  localStorage.removeItem(KEY);
}
