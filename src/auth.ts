import NextAuth from "next-auth"
import { db } from "@/lib/db"
import Credentials from "next-auth/providers/credentials"
import Google from "next-auth/providers/google"
import { DEFAULT_CURRENCY } from "@/lib/currency"

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
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
    async signIn({ user, account, profile }) {
      // For Google OAuth, create or update user in database
      if (account?.provider === "google" && profile?.email) {
        try {
          const existingUser = await db.user.findUnique({
            where: { email: profile.email },
          })

          if (!existingUser) {
            // Create new user for Google sign-in (works for both login and signup)
            const newUser = await db.user.create({
              data: {
                email: profile.email,
                name: profile.name || profile.email.split("@")[0],
                currencyPreference: DEFAULT_CURRENCY,
              },
            })
            // Update the user object with the new user id
            user.id = newUser.id
          } else {
            // User exists, use their id
            user.id = existingUser.id
          }
          return true
        } catch (error) {
          console.error("Error during Google sign-in:", error)
          return false
        }
      }
      return true
    },
    async jwt({ token, user, account, trigger }) {
      // When user logs in, attach user id and currency preference
      if (user) {
        token.sub = user.id
        token.email = user.email
        token.currencyPreference = DEFAULT_CURRENCY
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
