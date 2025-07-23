export interface PrimitiveUser {
  name?: string;
  email?: string;
  password?: string;
  role?: string;
}

export class User {
  constructor(private attributes: PrimitiveUser) {}

  static create(createUser: {
    name: string;
    email: string;
    password: string;
    role?: string;
  }): User {
    return new User({
      name: createUser.name,
      email: createUser.email,
      password: createUser.password,
      role: createUser?.role,
    });
  }

  static login(createUser: { email: string; password: string }): User {
    return new User({
      email: createUser.email,
      password: createUser.password,
    });
  }

  toPrimitives(): PrimitiveUser {
    return {
      name: this.attributes.name,
      email: this.attributes.email,
      role: this.attributes.role,
      password: this.attributes.password,
    };
  }
}
