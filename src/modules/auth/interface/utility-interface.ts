export interface GenerateToken {
  sub: string;
  email: string;
}

export interface updatePassword {
  password: string;
  newPassword: string;
}

export interface googleAuth {
  email: string;
  firstName: string;
  lastName: string;
}
