const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';
const USER_ID_KEY = 'user_id';

export const tokenUtils = {
  getToken: (): string | null => {
    return localStorage.getItem(TOKEN_KEY);
  },

  setToken: (token: string): void => {
    localStorage.setItem(TOKEN_KEY, token);
  },

  removeToken: (): void => {
    localStorage.removeItem(TOKEN_KEY);
  },

  getUser: () => {
    const user = localStorage.getItem(USER_KEY);
    return user ? JSON.parse(user) : null;
  },

  setUser: (user: any): void => {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },

  removeUser: (): void => {
    localStorage.removeItem(USER_KEY);
  },

  getUserId: (): string | null => {
    return sessionStorage.getItem(USER_ID_KEY);
  },

  setUserId: (userId: string): void => {
    sessionStorage.setItem(USER_ID_KEY, userId);
  },

  removeUserId: (): void => {
    sessionStorage.removeItem(USER_ID_KEY);
  },

  clear: (): void => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    sessionStorage.removeItem(USER_ID_KEY);
  },
};
