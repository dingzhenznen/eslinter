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

describe('useLoginForm validation', () => {
  it('should validate username on blur', () => {
    const { result } = renderHook(() => useLoginForm())

    act(() => {
      result.current.setUsername('ab')
    })

    expect(result.current.errors.username).toBe('用户名需3-20个字符')
  })

  it('should clear error when username is valid', () => {
    const { result } = renderHook(() => useLoginForm())

    act(() => {
      result.current.setUsername('ab')
    })
    act(() => {
      result.current.setUsername('validuser')
    })

    expect(result.current.errors.username).toBeUndefined()
  })

  it('should validate password on blur', () => {
    const { result } = renderHook(() => useLoginForm())

    act(() => {
      result.current.setPassword('12345')
    })

    expect(result.current.errors.password).toBe('密码至少6个字符')
  })

  it('should validate on submit with empty fields', () => {
    const { result } = renderHook(() => useLoginForm())

    act(() => {
      result.current.handleSubmit({ preventDefault: () => {} } as React.FormEvent)
    })

    expect(result.current.errors.username).toBe('请输入用户名')
    expect(result.current.errors.password).toBe('请输入密码')
  })

  it('should not submit if validation fails', () => {
    const onSubmit = jest.fn()
    const { result } = renderHook(() => useLoginForm({ onSubmit }))

    act(() => {
      result.current.handleSubmit({ preventDefault: () => {} } as React.FormEvent)
    })

    expect(result.current.isLoading).toBe(false)
  })
})
