import api from "./api";

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterCredentials {
  email: string;
  password: string;
}

const login = async (credentials: LoginCredentials) => {
  const response = await api.post("/auth/login", credentials);
  return response.data.data;
};

const register = async (credentials: RegisterCredentials) => {
  const response = await api.post("/auth/register", credentials);
  return response.data.data;
};

const logout = async () => {
  const response = await api.post("/auth/logout");
  return response.data;
};

const refreshToken = async () => {
  // The refreshToken is sent automatically as an HTTP-only cookie
  const response = await api.post("/auth/refresh-token");
  return response.data.data;
};

const authService = {
  login,
  register,
  logout,
  refreshToken,
};

export default authService;
