import type { AuthConfig } from 'convex/server'

export default {
  providers: [
    {
      // Clerk Issuer URL from your JWT template
      domain: process.env.CLERK_JWT_ISSUER_DOMAIN || 'https://secure-horse-0.clerk.accounts.dev',
      applicationID: 'convex',
    },
  ],
} satisfies AuthConfig
