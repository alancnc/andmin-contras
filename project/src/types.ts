export interface Password {
  id: string;
  title: string;
  username: string;
  password: string;
  website?: string;
  createdAt: number;
}

export interface User {
  username: string;
  password: string;
  faceDescriptor?: Float32Array;
}