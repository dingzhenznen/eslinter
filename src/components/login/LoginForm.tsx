'use client'

import { useState } from 'react'

import { PasswordInput } from '@/components/login/PasswordInput'
import { useLoginForm } from '@/components/login/useLoginForm'
import { Toast } from '@/components/ui/Toast'

interface LoginFormProps {
  onSuccess?: () => void
}

export function LoginForm({ onSuccess }: LoginFormProps) {
  const [toast, setToast] = useState<{
    message: string
    type: 'success' | 'error'
  } | null>(null)

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
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      const result = (await response.json()) as {
        success?: boolean
        message?: string
      }

      if (!response.ok) {
        throw new Error(result.message || '登录失败，请重试')
      }

      setToast({ message: '登录成功', type: 'success' })
      window.setTimeout(() => {
        onSuccess?.()
      }, 2000)
    },
  })

  const onFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    setToast(null)
    void handleSubmit(event).catch((error: unknown) => {
      const message =
        error instanceof Error && error.message
          ? error.message
          : '登录失败，请重试'

      setToast({ message, type: 'error' })
    })
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
            onChange={(event) => setUsername(event.target.value)}
            className={[
              'w-full rounded-lg border px-4 py-2 transition-colors',
              'focus:outline-none focus:ring-2',
              errors.username
                ? 'border-red-500 focus:ring-red-500'
                : 'border-zinc-300 focus:border-sky-500 focus:ring-sky-500',
            ].join(' ')}
            placeholder="请输入用户名"
            aria-invalid={errors.username ? 'true' : 'false'}
            aria-describedby={errors.username ? 'username-error' : undefined}
          />
          {errors.username ? (
            <p id="username-error" className="text-sm text-red-500">
              {errors.username}
            </p>
          ) : null}
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
          className={[
            'flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2.5',
            'bg-sky-600 font-medium text-white transition-colors',
            'hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2',
            'disabled:cursor-not-allowed disabled:opacity-60',
          ].join(' ')}
        >
          {isLoading ? '登录中...' : '登录'}
        </button>
      </form>

      {toast ? <Toast message={toast.message} type={toast.type} /> : null}
    </>
  )
}
