import { renderHook, act } from '@testing-library/react'
import { useLoginForm } from '@/components/login/useLoginForm'

describe('useLoginForm', () => {
  it('should initialize with empty fields and no errors', () => {
    const { result } = renderHook(() => useLoginForm())

    expect(result.current.username).toBe('')
    expect(result.current.password).toBe('')
    expect(result.current.errors).toEqual({})
    expect(result.current.isLoading).toBe(false)
    expect(result.current.isVisible).toBe(false)
  })
})
