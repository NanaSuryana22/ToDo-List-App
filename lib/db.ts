export type User = {
  id: string;
  fullName: string;
  email: string;
  password: string;
};

export type Todo = { id: string; userId: string; text: string };

export const users: User[] = [];
export const todos: Todo[] = [];
