export interface JwtPayload {
  sub: string;
  username: string;
  role: 'student' | 'coordinator' | 'admin';
}
