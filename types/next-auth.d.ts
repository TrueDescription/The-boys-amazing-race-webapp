import NextAuth from 'next-auth';
import { DefaultSession, DefaultUser } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      pin?: string;
    } & DefaultSession['user'];
  }

  interface User extends DefaultUser {
    pin?: string;
  }

  interface JWT {
    pin?: string;
  }
}