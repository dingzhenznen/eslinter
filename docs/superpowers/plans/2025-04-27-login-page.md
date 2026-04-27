# 登录页面实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 实现一个完整的登录页面，包含表单验证、密码显隐切换、加载状态和 Toast 提示

**Architecture:** 使用自定义 hook 分离表单逻辑，组件职责单一，通过 props 和回调进行通信

**Tech Stack:** Next.js 16, TypeScript, Tailwind CSS, Jest, React Testing Library

---

## 文件结构

| 文件 | 职责 |
|------|------|
| `src/components/login/useLoginForm.ts` | 表单状态管理、验证逻辑、提交处理 |
| `src/components/ui/Toast.tsx` | 全局 Toast 提示组件 |
| `src/components/login/PasswordInput.tsx` | 密码输入框（带显隐切换） |
| `src/components/login/LoginForm.tsx` | 登录表单 UI 组件 |
| `src/app/login/page.tsx` | 登录页面 |
| `src/__tests__/login/useLoginForm.test.ts` | useLoginForm hook 测试 |
| `src/__tests__/login/PasswordInput.test.tsx` | PasswordInput 组件测试 |
| `src/__tests__/login/LoginForm.test.tsx` | LoginForm 组件测试 |

---

## Task 1: useLoginForm Hook

**Files:**
- Create: `src/components/login/useLoginForm.ts`
- Test: `src/__tests__/login/useLoginForm.test.ts`

### Step 1: 编写测试 - 初始状态

```typescript
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
```

### Step 2: 运行测试验证失败

```bash
npm test -- src/__tests__/login/useLoginForm.test.ts
```

Expected: FAIL - "useLoginForm" 未定义

### Step 3: 实现初始状态

```typescript
'use client'

import { useState } from 'react'

interface FormErrors {
  username?: string
  password?: string
}

interface UseLoginFormReturn {
  username: string
  password: string
  errors: FormErrors
  isLoading: boolean
  isVisible: boolean
  setUsername: (value: string) => void
  setPassword: (value: string) => void
  toggleVisibility: () => void
  handleSubmit: (e: React.FormEvent) => void
}

export function useLoginForm(): UseLoginFormReturn {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<FormErrors>({})
  const [isLoading, setIsLoading] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  const toggleVisibility = () => setIsVisible(v => !v)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
  }

  return {
    username,
    password,
    errors,
    isLoading,
    isVisible,
    setUsername,
    setPassword,
    toggleVisibility,
    handleSubmit,
  }
}
```

### Step 4: 运行测试验证通过

```bash
npm test -- src/__tests__/login/useLoginForm.test.ts
```

Expected: PASS

### Step 5: 提交

```bash
git add src/__tests__/login/useLoginForm.test.ts src/components/login/useLoginForm.ts
git commit -m "feat: add useLoginForm hook with initial state"
```

---

### Step 6: 编写测试 - 验证逻辑

```typescript
import { renderHook, act, waitFor } from '@testing-library/react'
import { useLoginForm } from '@/components/login/useLoginForm'

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
```

### Step 7: 运行测试验证失败

```bash
npm test -- src/__tests__/login/useLoginForm.test.ts
```

Expected: FAIL - 验证逻辑未实现

### Step 8: 实现验证逻辑

修改 `src/components/login/useLoginForm.ts`：

```typescript
'use client'

import { useState, useCallback } from 'react'

interface FormErrors {
  username?: string
  password?: string
}

interface UseLoginFormProps {
  onSubmit?: (data: { username: string; password: string }) => Promise<void>
}

interface UseLoginFormReturn {
  username: string
  password: string
  errors: FormErrors
  isLoading: boolean
  isVisible: boolean
  setUsername: (value: string) => void
  setPassword: (value: string) => void
  toggleVisibility: () => void
  handleSubmit: (e: React.FormEvent) => Promise<void>
}

function validateUsername(username: string): string | undefined {
  if (!username) return '请输入用户名'
  if (username.length < 3 || username.length > 20) return '用户名需3-20个字符'
  return undefined
}

function validatePassword(password: string): string | undefined {
  if (!password) return '请输入密码'
  if (password.length < 6) return '密码至少6个字符'
  return undefined
}

export function useLoginForm({ onSubmit }: UseLoginFormProps = {}): UseLoginFormReturn {
  const [username, setUsernameState] = useState('')
  const [password, setPasswordState] = useState('')
  const [errors, setErrors] = useState<FormErrors>({})
  const [isLoading, setIsLoading] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  const setUsername = useCallback((value: string) => {
    setUsernameState(value)
    if (errors.username) {
      setErrors(prev => ({ ...prev, username: undefined }))
    }
  }, [errors.username])

  const setPassword = useCallback((value: string) => {
    setPasswordState(value)
    if (errors.password) {
      setErrors(prev => ({ ...prev, password: undefined }))
    }
  }, [errors.password])

  const toggleVisibility = () => setIsVisible(v => !v)

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()

    const usernameError = validateUsername(username)
    const passwordError = validatePassword(password)

    setErrors({
      username: usernameError,
      password: passwordError,
    })

    if (usernameError || passwordError) {
      return
    }

    setIsLoading(true)
    try {
      await onSubmit?.({ username, password })
    } finally {
      setIsLoading(false)
    }
  }, [username, password, onSubmit])

  return {
    username,
    password,
    errors,
    isLoading,
    isVisible,
    setUsername,
    setPassword,
    toggleVisibility,
    handleSubmit,
  }
}
```

### Step 9: 运行测试验证通过

```bash
npm test -- src/__tests__/login/useLoginForm.test.ts
```

Expected: PASS

### Step 10: 提交

```bash
git add src/__tests__/login/useLoginForm.test.ts src/components/login/useLoginForm.ts
git commit -m "feat: add form validation to useLoginForm"
```

---

## Task 2: Toast 组件

**Files:**
- Create: `src/components/ui/Toast.tsx`
- Test: `src/__tests__/login/Toast.test.tsx`

### Step 1: 编写测试

```typescript
import { render, screen } from '@testing-library/react'
import { Toast } from '@/components/ui/Toast'

describe('Toast', () => {
  it('should not render when message is empty', () => {
    const { container } = render(<Toast message="" type="success" />)
    expect(container.firstChild).toBeNull()
  })

  it('should render success message', () => {
    render(<Toast message="登录成功" type="success" />)
    expect(screen.getByText('登录成功')).toBeInTheDocument()
  })

  it('should render error message', () => {
    render(<Toast message="登录失败" type="error" />)
    expect(screen.getByText('登录失败')).toBeInTheDocument()
  })

  it('should have correct aria role for success', () => {
    render(<Toast message="成功" type="success" />)
    expect(screen.getByRole('status')).toBeInTheDocument()
  })

  it('should have correct aria role for error', () => {
    render(<Toast message="错误" type="error" />)
    expect(screen.getByRole('alert')).toBeInTheDocument()
  })
})
```

### Step 2: 运行测试验证失败

```bash
npm test -- src/__tests__/login/Toast.test.tsx
```

Expected: FAIL

### Step 3: 实现 Toast 组件

```typescript
'use client'

interface ToastProps {
  message: string
  type: 'success' | 'error'
}

export function Toast({ message, type }: ToastProps) {
  if (!message) return null

  const isSuccess = type === 'success'
  const baseClasses = 'fixed top-4 left-1/2 -translate-x-1/2 px-6 py-3 rounded-lg shadow-lg font-medium transition-all duration-300'
  const typeClasses = isSuccess
    ? 'bg-green-500 text-white'
    : 'bg-red-500 text-white'

  return (
    <div
      className={`${baseClasses} ${typeClasses}`}
      role={isSuccess ? 'status' : 'alert'}
      aria-live="polite"
    >
      {message}
    </div>
  )
}
```

### Step 4: 运行测试验证通过

```bash
npm test -- src/__tests__/login/Toast.test.tsx
```

Expected: PASS

### Step 5: 提交

```bash
git add src/__tests__/login/Toast.test.tsx src/components/ui/Toast.tsx
git commit -m "feat: add Toast component for notifications"
```

---

## Task 3: PasswordInput 组件

**Files:**
- Create: `src/components/login/PasswordInput.tsx`
- Test: `src/__tests__/login/PasswordInput.test.tsx`

### Step 1: 编写测试

```typescript
import { render, screen, fireEvent } from '@testing-library/react'
import { PasswordInput } from '@/components/login/PasswordInput'

describe('PasswordInput', () => {
  const defaultProps = {
    value: '',
    onChange: jest.fn(),
    error: undefined,
    isVisible: false,
    onToggleVisibility: jest.fn(),
  }

  it('should render password input', () => {
    render(<PasswordInput {...defaultProps} />)
    expect(screen.getByLabelText('密码')).toBeInTheDocument()
  })

  it('should have type password by default', () => {
    render(<PasswordInput {...defaultProps} />)
    expect(screen.getByLabelText('密码')).toHaveAttribute('type', 'password')
  })

  it('should have type text when visible', () => {
    render(<PasswordInput {...defaultProps} isVisible={true} />)
    expect(screen.getByLabelText('密码')).toHaveAttribute('type', 'text')
  })

  it('should call onChange when input changes', () => {
    const onChange = jest.fn()
    render(<PasswordInput {...defaultProps} onChange={onChange} />)

    fireEvent.change(screen.getByLabelText('密码'), { target: { value: 'password123' } })
    expect(onChange).toHaveBeenCalledWith('password123')
  })

  it('should call onToggleVisibility when button clicked', () => {
    const onToggleVisibility = jest.fn()
    render(<PasswordInput {...defaultProps} onToggleVisibility={onToggleVisibility} />)

    fireEvent.click(screen.getByRole('button'))
    expect(onToggleVisibility).toHaveBeenCalled()
  })

  it('should display error message', () => {
    render(<PasswordInput {...defaultProps} error="密码错误" />)
    expect(screen.getByText('密码错误')).toBeInTheDocument()
  })

  it('should have aria-invalid when error exists', () => {
    render(<PasswordInput {...defaultProps} error="有错误" />)
    expect(screen.getByLabelText('密码')).toHaveAttribute('aria-invalid', 'true')
  })
})
```

### Step 2: 运行测试验证失败

```bash
npm test -- src/__tests__/login/PasswordInput.test.tsx
```

Expected: FAIL

### Step 3: 实现 PasswordInput 组件

```typescript
'use client'

interface PasswordInputProps {
  value: string
  onChange: (value: string) => void
  error?: string
  isVisible: boolean
  onToggleVisibility: () => void
}

export function PasswordInput({
  value,
  onChange,
  error,
  isVisible,
  onToggleVisibility,
}: PasswordInputProps) {
  return (
    <div className="space-y-1">
      <label htmlFor="password" className="block text-sm font-medium text-zinc-700">
        密码
      </label>
      <div className="relative">
        <input
          id="password"
          type={isVisible ? 'text' : 'password'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`
            w-full px-4 py-2 pr-10 rounded-lg border
            focus:outline-none focus:ring-2 focus:ring-blue-500
            transition-colors
            ${error
              ? 'border-red-500 focus:ring-red-500'
              : 'border-zinc-300 focus:border-blue-500'
            }
          `}
          placeholder="请输入密码"
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? 'password-error' : undefined}
        />
        <button
          type="button"
          onClick={onToggleVisibility}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 focus:outline-none"
          aria-label={isVisible ? '隐藏密码' : '显示密码'}
        >
          {isVisible ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a10.059 10.059 0 013.999-5.123m3.75-1.987A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.542 7a10.059 10.059 0 01-3.999 5.123M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3l18 18" />
            </svg>
          )}
        </button>
      </div>
      {error && (
        <p id="password-error" className="text-sm text-red-500">
          {error}
        </p>
      )}
    </div>
  )
}
```

### Step 4: 运行测试验证通过

```bash
npm test -- src/__tests__/login/PasswordInput.test.tsx
```

Expected: PASS

### Step 5: 提交

```bash
git add src/__tests__/login/PasswordInput.test.tsx src/components/login/PasswordInput.tsx
git commit -m "feat: add PasswordInput component with visibility toggle"
```

---

## Task 4: LoginForm 组件

**Files:**
- Create: `src/components/login/LoginForm.tsx`
- Test: `src/__tests__/login/LoginForm.test.tsx`

### Step 1: 编写测试

```typescript
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { LoginForm } from '@/components/login/LoginForm'

describe('LoginForm', () => {
  it('should render form with all fields', () => {
    render(<LoginForm />)

    expect(screen.getByLabelText('用户名')).toBeInTheDocument()
    expect(screen.getByLabelText('密码')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /登录/i })).toBeInTheDocument()
  })

  it('should show validation errors on submit with empty fields', async () => {
    render(<LoginForm />)

    fireEvent.click(screen.getByRole('button', { name: /登录/i }))

    await waitFor(() => {
      expect(screen.getByText('请输入用户名')).toBeInTheDocument()
      expect(screen.getByText('请输入密码')).toBeInTheDocument()
    })
  })

  it('should show loading state during submission', async () => {
    const mockSubmit = jest.fn(() => new Promise(resolve => setTimeout(resolve, 100)))
    render(<LoginForm onSubmit={mockSubmit} />)

    fireEvent.change(screen.getByLabelText('用户名'), { target: { value: 'testuser' } })
    fireEvent.change(screen.getByLabelText('密码'), { target: { value: 'password123' } })
    fireEvent.click(screen.getByRole('button', { name: /登录/i }))

    await waitFor(() => {
      expect(screen.getByText('登录中...')).toBeInTheDocument()
    })
  })

  it('should call onSubmit with credentials', async () => {
    const mockSubmit = jest.fn(() => Promise.resolve())
    render(<LoginForm onSubmit={mockSubmit} />)

    fireEvent.change(screen.getByLabelText('用户名'), { target: { value: 'testuser' } })
    fireEvent.change(screen.getByLabelText('密码'), { target: { value: 'password123' } })
    fireEvent.click(screen.getByRole('button', { name: /登录/i }))

    await waitFor(() => {
      expect(mockSubmit).toHaveBeenCalledWith({ username: 'testuser', password: 'password123' })
    })
  })

  it('should show success toast on successful login', async () => {
    const mockSubmit = jest.fn(() => Promise.resolve())
    render(<LoginForm onSubmit={mockSubmit} onSuccess={() => {}} />)

    fireEvent.change(screen.getByLabelText('用户名'), { target: { value: 'testuser' } })
    fireEvent.change(screen.getByLabelText('密码'), { target: { value: 'password123' } })
    fireEvent.click(screen.getByRole('button', { name: /登录/i }))

    await waitFor(() => {
      expect(screen.getByText('登录成功')).toBeInTheDocument()
    })
  })

  it('should show error toast on failed login', async () => {
    const mockSubmit = jest.fn(() => Promise.reject(new Error('登录失败')))
    render(<LoginForm onSubmit={mockSubmit} />)

    fireEvent.change(screen.getByLabelText('用户名'), { target: { value: 'testuser' } })
    fireEvent.change(screen.getByLabelText('密码'), { target: { value: 'password123' } })
    fireEvent.click(screen.getByRole('button', { name: /登录/i }))

    await waitFor(() => {
      expect(screen.getByText('登录失败，请重试')).toBeInTheDocument()
    })
  })
})
```

### Step 2: 运行测试验证失败

```bash
npm test -- src/__tests__/login/LoginForm.test.tsx
```

Expected: FAIL

### Step 3: 实现 LoginForm 组件

```typescript
'use client'

import { useState } from 'react'
import { useLoginForm } from './useLoginForm'
import { PasswordInput } from './PasswordInput'
import { Toast } from '@/components/ui/Toast'

interface LoginFormProps {
  onSubmit?: (data: { username: string; password: string }) => Promise<void>
  onSuccess?: () => void
}

export function LoginForm({ onSubmit, onSuccess }: LoginFormProps) {
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  const {
    username,
    password,
    errors,
    isLoading,
    isVisible,
    setUsername,
    setPassword,
    toggleVisibility,
    handleSubmit,
  } = useLoginForm({
    onSubmit: async (data) => {
      try {
        await onSubmit?.(data)
        setToast({ message: '登录成功', type: 'success' })
        setTimeout(() => {
          onSuccess?.()
        }, 2000)
      } catch {
        setToast({ message: '登录失败，请重试', type: 'error' })
      }
    },
  })

  const onFormSubmit = (e: React.FormEvent) => {
    setToast(null)
    handleSubmit(e)
  }

  return (
    <>
      <form onSubmit={onFormSubmit} className="space-y-6">
        <div className="space-y-1">
          <label htmlFor="username" className="block text-sm font-medium text-zinc-700">
            用户名
          </label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className={`
              w-full px-4 py-2 rounded-lg border
              focus:outline-none focus:ring-2 focus:ring-blue-500
              transition-colors
              ${errors.username
                ? 'border-red-500 focus:ring-red-500'
                : 'border-zinc-300 focus:border-blue-500'
              }
            `}
            placeholder="请输入用户名"
            aria-invalid={errors.username ? 'true' : 'false'}
            aria-describedby={errors.username ? 'username-error' : undefined}
          />
          {errors.username && (
            <p id="username-error" className="text-sm text-red-500">
              {errors.username}
            </p>
          )}
        </div>

        <PasswordInput
          value={password}
          onChange={setPassword}
          error={errors.password}
          isVisible={isVisible}
          onToggleVisibility={toggleVisibility}
        />

        <button
          type="submit"
          disabled={isLoading}
          className={`
            w-full py-2.5 px-4 rounded-lg font-medium text-white
            bg-gradient-to-r from-blue-500 to-blue-600
            hover:from-blue-600 hover:to-blue-700
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
            transition-all duration-200
            disabled:opacity-50 disabled:cursor-not-allowed
            flex items-center justify-center gap-2
          `}
        >
          {isLoading ? (
            <>
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              登录中...
            </>
          ) : (
            '登录'
          )}
        </button>
      </form>

      {toast && <Toast message={toast.message} type={toast.type} />}
    </>
  )
}
```

### Step 4: 运行测试验证通过

```bash
npm test -- src/__tests__/login/LoginForm.test.tsx
```

Expected: PASS

### Step 5: 提交

```bash
git add src/__tests__/login/LoginForm.test.tsx src/components/login/LoginForm.tsx
git commit -m "feat: add LoginForm component with validation and toast"
```

---

## Task 5: 登录页面

**Files:**
- Create: `src/app/login/page.tsx`

### Step 1: 实现登录页面

```typescript
import { LoginForm } from '@/components/login/LoginForm'
import Link from 'next/link'

export default function LoginPage() {
  // 模拟登录 API 调用
  const handleSubmit = async (data: { username: string; password: string }) => {
    // 模拟 API 延迟
    await new Promise(resolve => setTimeout(resolve, 1000))

    // 模拟验证：用户名 admin，密码 123456
    if (data.username === 'admin' && data.password === '123456') {
      console.log('登录成功:', data)
      return
    }

    throw new Error('用户名或密码错误')
  }

  const handleSuccess = () => {
    // 登录成功后跳转到首页
    window.location.href = '/'
  }

  return (
    <div className="min-h-screen bg-zinc-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-bold text-zinc-900">欢迎回来</h1>
            <p className="text-zinc-500">请登录您的账户</p>
          </div>

          <LoginForm onSubmit={handleSubmit} onSuccess={handleSuccess} />

          <div className="text-center">
            <Link
              href="#"
              className="text-sm text-blue-500 hover:text-blue-600 transition-colors"
            >
              忘记密码？
            </Link>
          </div>
        </div>

        <p className="text-center text-sm text-zinc-400 mt-6">
          测试账号: admin / 123456
        </p>
      </div>
    </div>
  )
}
```

### Step 2: 提交

```bash
git add src/app/login/page.tsx
git commit -m "feat: add login page with form integration"
```

---

## Task 6: 集成测试

**Files:**
- Modify: `src/__tests__/login/page.test.tsx`

### Step 1: 编写页面集成测试

```typescript
import { render, screen } from '@testing-library/react'
import LoginPage from '@/app/login/page'

describe('Login Page', () => {
  it('should render login page with heading', () => {
    render(<LoginPage />)

    expect(screen.getByText('欢迎回来')).toBeInTheDocument()
    expect(screen.getByText('请登录您的账户')).toBeInTheDocument()
  })

  it('should render login form', () => {
    render(<LoginPage />)

    expect(screen.getByLabelText('用户名')).toBeInTheDocument()
    expect(screen.getByLabelText('密码')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /登录/i })).toBeInTheDocument()
  })

  it('should render forgot password link', () => {
    render(<LoginPage />)

    expect(screen.getByText('忘记密码？')).toBeInTheDocument()
  })

  it('should render test account hint', () => {
    render(<LoginPage />)

    expect(screen.getByText(/测试账号/i)).toBeInTheDocument()
  })
})
```

### Step 2: 运行测试验证通过

```bash
npm test -- src/__tests__/login/page.test.tsx
```

Expected: PASS

### Step 3: 提交

```bash
git add src/__tests__/login/page.test.tsx
git commit -m "test: add login page integration tests"
```

---

## 最终验证

### 运行全部测试

```bash
npm test
```

Expected: 所有测试通过

### 运行 ESLint

```bash
npm run lint
```

Expected: 无错误

### 最终提交

```bash
git commit --allow-empty -m "feat: complete login page implementation"
```

---

## 验证清单

- [ ] useLoginForm hook 测试通过
- [ ] Toast 组件测试通过
- [ ] PasswordInput 组件测试通过
- [ ] LoginForm 组件测试通过
- [ ] 登录页面测试通过
- [ ] ESLint 无错误
- [ ] 所有文件已提交

## 使用说明

访问 `http://localhost:3000/login` 查看登录页面。

**测试账号:**
- 用户名: `admin`
- 密码: `123456`

**功能:**
- 用户名/密码验证
- 密码显示/隐藏切换
- 加载状态显示
- 成功/失败 Toast 提示
- 登录成功后 2 秒自动跳转首页
