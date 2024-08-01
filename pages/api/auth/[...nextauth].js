import { sql } from "@vercel/postgres";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

// CREATE TABLE team (
//     pin INTEGER,
//     pageState INTEGER,
//     riddleStage INTEGER,
//     taskStage INTEGER
// );


export default NextAuth({
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: 'PIN',
      credentials: {
        pin: { label: "PIN", type: "password", placeholder: "Enter your 4-digit PIN" },
      },
      authorize: async (credentials) => {
        try {
          const existingPin = await sql`SELECT pin FROM team WHERE pin = ${credentials.pin};`;
          if (existingPin.rowCount != null && existingPin.rowCount == 1) {
            const user = {
              pin: credentials.pin,
            };
            return user;
          } else {
            return null;
          }
        } catch (error) {
          console.log(error);
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        token.pin = user.pin;
      }
      return token;
    },
    session: async ({ session, token }) => {
      if (token.pin) {
        session.user.pin = token.pin;
      }
      return session;
    }
  },
  pages: {
    signIn: '/auth/signin',
  },
});