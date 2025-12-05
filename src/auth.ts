import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { db } from "@/lib/db"
import Credentials from "next-auth/providers/credentials"
import Google from "next-auth/providers/google"
import { DEFAULT_CURRENCY } from "@/lib/currency"

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
        const email = credentials.email as string
        const password = credentials.password as string

        if (!email || !password) return null

        const user = await db.user.findUnique({
          where: { email },
        })

        if (!user || !(user as any).password) return null

        // @ts-ignore - bcryptjs types might conflict slightly in strict mode but works at runtime
        const bcrypt = require("bcryptjs")
        const passwordsMatch = await bcrypt.compare(password, (user as any).password)

        if (!passwordsMatch) return null

        return user
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      // When user logs in, attach currency preference
      if (user?.id) {
        const dbUser = await db.user.findUnique({
          where: { id: user.id },
          select: { currencyPreference: true },
        })
        token.currencyPreference = dbUser?.currencyPreference || DEFAULT_CURRENCY
      }
      return token
    },
    async session({ session, token }) {
      if (token.sub && session.user) {
        // Fix for legacy test user ID
        if (token.sub === "user-1") {
          session.user.id = "mock-user-id";
        } else {
          session.user.id = token.sub;
        }
      }
      if (session.user) {
        // @ts-ignore add custom field
        session.user.currencyPreference = (token as any).currencyPreference || DEFAULT_CURRENCY
      }
      return session;
    },
  },
})
