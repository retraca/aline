import type { NextRequest } from 'next/server'

export function withFeatureFlags(handler: (req: NextRequest) => Promise<Response> | Response) {
  return async (req: NextRequest) => {
    // Placeholder: add gating when flags are used for routes
    return handler(req)
  }
}


