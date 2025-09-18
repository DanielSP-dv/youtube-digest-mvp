// CHANGED: Added NextAuth type extensions to include accessToken in session
// Reason: NextAuth v4 doesn't include OAuth access tokens by default
import NextAuth from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      name?: string | null
      email?: string | null
      image?: string | null
      accessToken?: string
    }
  }

  interface JWT {
    accessToken?: string
  }
}