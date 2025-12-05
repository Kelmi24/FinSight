import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { db } from "@/lib/db"
import Credentials from "next-auth/providers/credentials"
import Google from "next-auth/providers/google"

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(db),
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        // MOCK USER FOR TESTING - Ensure user exists in DB
        const user = await db.user.upsert({
          where: { email: "demo@example.com" },
          update: {},
          create: {
            id: "mock-user-id",
            name: "Demo User",
            email: "demo@example.com",
            image: "https://github.com/shadcn.png",
          },
        })
        
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async session({ session, token }) {
      if (token.sub && session.user) {
        // Fix for legacy test user ID
        if (token.sub === "user-1") {
          session.user.id = "mock-user-id";
        } else {
          session.user.id = token.sub;
        }
      }
      return session;
    },
  },
})
