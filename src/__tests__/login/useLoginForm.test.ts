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

  it('should validate on submit with empty fields', async () => {
    const { result } = renderHook(() => useLoginForm())
    const preventDefault = jest.fn()

    await act(async () => {
      await result.current.handleSubmit({ preventDefault } as React.FormEvent)
    })

    expect(preventDefault).toHaveBeenCalledTimes(1)
    expect(result.current.errors.username).toBe('请输入用户名')
    expect(result.current.errors.password).toBe('请输入密码')
  })

  it('should validate invalid username and password lengths on submit', async () => {
    const { result } = renderHook(() => useLoginForm())

    act(() => {
      result.current.setUsername('ab')
      result.current.setPassword('12345')
    })

    await act(async () => {
      await result.current.handleSubmit({ preventDefault: jest.fn() } as React.FormEvent)
    })

    expect(result.current.errors.username).toBe('用户名需3-20个字符')
    expect(result.current.errors.password).toBe('密码至少6个字符')
  })

  it('should not submit or start loading if validation fails', async () => {
    const onSubmit = jest.fn()
    const { result } = renderHook(() => useLoginForm({ onSubmit }))

    await act(async () => {
      await result.current.handleSubmit({ preventDefault: jest.fn() } as React.FormEvent)
    })

    expect(onSubmit).not.toHaveBeenCalled()
    expect(result.current.isLoading).toBe(false)
  })

  it('should clear field errors when input changes', async () => {
    const { result } = renderHook(() => useLoginForm())

    await act(async () => {
      await result.current.handleSubmit({ preventDefault: jest.fn() } as React.FormEvent)
    })

    expect(result.current.errors.username).toBe('请输入用户名')
    expect(result.current.errors.password).toBe('请输入密码')

    act(() => {
      result.current.setUsername('validuser')
      result.current.setPassword('123456')
    })

    expect(result.current.errors.username).toBeUndefined()
    expect(result.current.errors.password).toBeUndefined()
  })

  it('should submit valid credentials and reset loading after completion', async () => {
    let resolveSubmit: (() => void) | undefined
    let submission: Promise<void> | undefined
    const onSubmit = jest.fn(
      () =>
        new Promise<void>(resolve => {
          resolveSubmit = resolve
        }),
    )
    const { result } = renderHook(() => useLoginForm({ onSubmit }))

    act(() => {
      result.current.setUsername('validuser')
      result.current.setPassword('123456')
    })

    act(() => {
      submission = result.current.handleSubmit({ preventDefault: jest.fn() } as React.FormEvent)
    })

    expect(result.current.isLoading).toBe(true)
    expect(onSubmit).toHaveBeenCalledWith({ username: 'validuser', password: '123456' })

    resolveSubmit?.()
    await act(async () => {
      await submission
    })

    expect(result.current.errors).toEqual({ username: undefined, password: undefined })
    expect(result.current.isLoading).toBe(false)
  })
})
