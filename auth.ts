import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials"
import { NextResponse } from "next/server";

 
// Predefined users (demo). In production, move to a DB and hash passwords.
const predefinedUsers = [
  { id: "1", name: "Admin", email: "marketing@mccoin.com", password: "Admin#2025", role: "admin" },
  { id: "2", name: "Admin", email: "cm@mccoin.com", password: "Admin#2025", role: "admin" },
] as const;

export const { handlers, signIn, signOut, auth } = NextAuth({
  session: { strategy: "jwt" },
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        const email = credentials?.email?.toString().toLowerCase() || "";
        const password = credentials?.password?.toString() || "";

        const found = predefinedUsers.find((u) => u.email.toLowerCase() === email && u.password === password);
        if (!found) throw new Error("Invalid credentials.");

        return { id: found.id, name: found.name, email: found.email, role: (found as any).role } as any;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.userId = (user as any).id;
        token.name = user.name;
        token.email = user.email;
        token.role = (user as any).role;
      }
      return token;
    },
    async session({ session, token }) {
      session.user = {
        ...session.user,
        id: (token as any).userId as string,
        role: (token as any).role as string,
      } as any;
      return session;
    },
    authorized({ auth, request }) {
      const { pathname } = request.nextUrl;
      // Redirect home based on auth state
      if (pathname === "/") {
        const url = request.nextUrl.clone();
        url.pathname = auth ? "/dashboard" : "/sign-in";
        return NextResponse.redirect(url);
      }
      // Protect dashboard: require authentication
      if (pathname.startsWith("/dashboard") && !auth) {
        const url = request.nextUrl.clone();
        url.pathname = "/sign-in";
        return NextResponse.redirect(url);
      }
      return true;
    },
  },
  trustHost: true,
})