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
  if (!username) {
    return '请输入用户名'
  }
  if (username.length < 3 || username.length > 20) {
    return '用户名需3-20个字符'
  }
  return undefined
}

function validatePassword(password: string): string | undefined {
  if (!password) {
    return '请输入密码'
  }
  if (password.length < 6) {
    return '密码至少6个字符'
  }
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
    // 输入时清除错误，而不是验证
    setErrors(prev => ({ ...prev, username: undefined }))
  }, [])

  const setPassword = useCallback((value: string) => {
    setPasswordState(value)
    // 输入时清除错误，而不是验证
    setErrors(prev => ({ ...prev, password: undefined }))
  }, [])

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
