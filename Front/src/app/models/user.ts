export class User {
  id?: string;
  username: string;
  password: string;
  role: 'admin' | 'user' | 'guest';

  constructor(username: string, password: string, role: 'admin' | 'user' | 'guest', id?: string) {
    this.id = id;
    this.username = username;
    this.password = password;
    this.role = role;
  }
}