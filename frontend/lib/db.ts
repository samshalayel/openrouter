// Simple in-memory user store for development
// In production, use a real database

interface StoredUser {
  id: string;
  email: string;
  name: string;
  password: string;
}

let users: StoredUser[] = [];
let idCounter = 1;

export function createUser(email: string, name: string, passwordHash: string): StoredUser {
  const newUser: StoredUser = {
    id: String(idCounter++),
    email,
    name,
    password: passwordHash,
  };
  users.push(newUser);
  return newUser;
}

export function findUserByEmail(email: string): StoredUser | undefined {
  return users.find(u => u.email === email);
}

export function findUserById(id: string): StoredUser | undefined {
  return users.find(u => u.id === id);
}

export function getAllUsers(): StoredUser[] {
  return users;
}
