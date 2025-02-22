import { Role } from "@prisma/client";

export type User = {
  id: string;
  email: string;
  username: string;
  role: Role;
  createdAt: string | Date;
  updatedAt: string | Date;
  password?: string;
};

export interface Post {
  id: number;
  title: string;
  content: string | null;
  published: boolean;
  authorId: string;
  createdAt: string;
  updatedAt: string;
  author: {
    id: string;
    username: string;
    email: string;
  };
}

export type LoginPayload = {
  email: string;
  password: string;
};

export type AuthResponse = {
  user: User;
  token: string;
};
