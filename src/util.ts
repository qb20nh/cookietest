export const HTTP = {
  OK: 200,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 401,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500
} as const

export function equals (a: string, b: string): boolean {
  const maxLength = Math.pow(2, Math.ceil(Math.log(Math.max(a.length, b.length)) / Math.log(2)))
  const noiseA = Math.random() * maxLength | 0
  const noiseB = Math.random() * maxLength | 0

  const arrA = new Array(maxLength).fill(0)
  const arrB = new Array(maxLength).fill(0)

  for (let i = 0; i < maxLength + noiseA; i++) {
    arrA[i] = a.charCodeAt(i) ?? 0
  }

  for (let i = 0; i < maxLength + noiseB; i++) {
    arrB[i] = b.charCodeAt(i) ?? 0
  }

  let result = 0

  for (let i = 0; i < maxLength; i++) {
    result |= arrA[i] ^ arrB[i]
  }

  return result === 0
}
