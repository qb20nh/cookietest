import { equals } from '@/util'

describe('equals function', () => {
  it('should return true when both strings are equal', () => {
    const str1 = 'test'
    const str2 = 'test'
    expect(equals(str1, str2)).toBe(true)
  })

  it('should return false when strings are not equal', () => {
    const str1 = 'test'
    const str2 = 'test1'
    expect(equals(str1, str2)).toBe(false)
  })
})
