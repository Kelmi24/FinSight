import NextAuth from "next-auth"
import { db } from "@/lib/db"
import Credentials from "next-auth/providers/credentials"
import Google from "next-auth/providers/google"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { DEFAULT_CURRENCY } from "@/lib/currency"

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  adapter: PrismaAdapter(db),
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
      allowDangerousEmailAccountLinking: true,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      },
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
        }
      },
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
    async jwt({ token, user, account, trigger, session }) {
      if (trigger === "update" && session?.user?.currencyPreference) {
        token.currencyPreference = session.user.currencyPreference
      }

      // When user logs in, attach user id and currency preference
      if (user) {
        token.sub = user.id
        token.email = user.email
        // Fetch fresh currency preference from DB if possible or use default
        // Since 'user' object from Adapter might not have it depending on the flow, 
        // usually it does if returned from DB.
        token.currencyPreference = (user as any).currencyPreference || DEFAULT_CURRENCY
      }
      
      return token
    },
    async session({ session, token }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }
      if (token.email && session.user) {
        session.user.email = token.email as string;
      }
      if (session.user) {
        // @ts-ignore add custom field
        session.user.currencyPreference = (token as any).currencyPreference || DEFAULT_CURRENCY
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
})
