import { EncryptJWT, jwtDecrypt } from 'jose'

import { getServerEnv } from '@/core/config/env.server'

export interface EncryptedTokens {
  accessToken: string
  refreshToken: string
  idToken: string
}

function getEncryptionKey(): Uint8Array {
  const { jweSecret } = getServerEnv()
  return new TextEncoder().encode(jweSecret.slice(0, 32))
}

export async function encryptTokens(tokens: EncryptedTokens): Promise<string> {
  const key = getEncryptionKey()

  return new EncryptJWT({ ...tokens })
    .setProtectedHeader({ alg: 'dir', enc: 'A256GCM' })
    .setIssuedAt()
    .encrypt(key)
}

export async function decryptTokens(jwe: string): Promise<EncryptedTokens> {
  const key = getEncryptionKey()
  const { payload } = await jwtDecrypt(jwe, key)

  return payload as unknown as EncryptedTokens
}
