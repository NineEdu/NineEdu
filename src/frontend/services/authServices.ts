import http from "@/lib/http";

export interface User {
  _id: string;
  fullName: string;
  email: string;
  role: "admin" | "instructor" | "student";
  avatar?: string;
  enrolledCourses?: string[];
  createdAt: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export const authService = {
  login: async (data: any) => {
    return http.post("/auth/login", data) as Promise<AuthResponse>;
  },

  register: async (data: any) => {
    return http.post("/auth/register", data);
  },

  loginWithGoogle: async (firebaseToken: string) => {
    return http.post("/auth/firebase", {
      token: firebaseToken,
    }) as Promise<AuthResponse>;
  },

  getMe: async (): Promise<User> => {
    return http.get("/auth/me") as unknown as User;
  },
};
