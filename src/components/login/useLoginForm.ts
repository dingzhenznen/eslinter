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
