import { JWT } from "next-auth/jwt";
import { env } from "@/app/env.mjs";

export async function refreshToken(token: JWT): Promise<JWT> {
    try {
    console.log('Refreshing token with refreshToken:', token.refreshToken?.substring(0, 10) + '...');
    

      const response = await fetch(`${env.API_URL}/auth/token-refresh`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token.refreshToken}`,
        },
      });
  
      if (!response.ok) {
        console.error('Token refresh failed with status:', response.status);
        return {
          ...token,
          error: 'RefreshAccessTokenError',
          accessToken: undefined,
          accessTokenExpires: undefined,
        };
      }
      const refreshedTokens = await response.json();
      console.log('Token refreshed successfully, new expiry:', refreshedTokens.expiresIn, 'seconds');

      return {
        ...token,
        accessToken: refreshedTokens.accessToken,
        accessTokenExpires: Date.now() + refreshedTokens.expiresIn * 1000,
        refreshToken: refreshedTokens.refreshToken ?? token.refreshToken,
      };
    } catch (error) {
      console.log('Token refresh error:', error);
      return {
        ...token,
        error: 'RefreshAccessTokenError',
        accessToken: undefined,
        accessTokenExpires: undefined,
      };
    }
  }

  export function isTokenExpired(token: JWT | null): boolean {
  if (!token) return true;
  if (!token.accessTokenExpires) return true;
  
  const isExpired = Date.now() >= (token.accessTokenExpires as number);
  
  if (isExpired) {
    console.log('Token is expired:', {
      now: new Date().toISOString(),
      expires: new Date(token.accessTokenExpires as number).toISOString()
    });
  }
  
  return isExpired;
}


  export function isTokenExpiring(token: JWT): boolean {
    if(!token.accessTokenExpires) {
        return false;
    }
    return Date.now() >= (token.accessTokenExpires - 60000);
  }