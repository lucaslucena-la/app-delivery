import type { User } from "../services/auth";

const KEY = "delivery:user";

export function saveUser(user: User) {
  localStorage.setItem(KEY, JSON.stringify(user));
  //dispara um aviso para toda a aplicação
  window.dispatchEvent(new CustomEvent('authChange'));
}


export function getUser(): User | null {
  const raw = localStorage.getItem(KEY);
  return raw ? JSON.parse(raw) : null;
}
export function clearUser() {
  localStorage.removeItem(KEY);

  window.dispatchEvent(new CustomEvent('authChange'))

}
