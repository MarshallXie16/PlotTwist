import { cn } from '../utils'

describe('cn utility function', () => {
  it('merges class names correctly', () => {
    const result = cn('text-red-500', 'bg-blue-500')
    expect(result).toBe('text-red-500 bg-blue-500')
  })

  it('handles conflicting Tailwind classes', () => {
    const result = cn('text-red-500', 'text-blue-500')
    // tailwind-merge should keep only the last conflicting class
    expect(result).toBe('text-blue-500')
  })

  it('handles conditional classes', () => {
    const isActive = true
    const result = cn('base-class', isActive && 'active-class')
    expect(result).toBe('base-class active-class')
  })

  it('filters out falsy values', () => {
    const result = cn('text-red-500', false, null, undefined, 'bg-blue-500')
    expect(result).toBe('text-red-500 bg-blue-500')
  })

  it('handles arrays of class names', () => {
    const result = cn(['text-red-500', 'bg-blue-500'])
    expect(result).toBe('text-red-500 bg-blue-500')
  })

  it('returns empty string for no arguments', () => {
    const result = cn()
    expect(result).toBe('')
  })
})
