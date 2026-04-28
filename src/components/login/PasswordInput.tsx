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
          onChange={(event) => onChange(event.target.value)}
          className={[
            'w-full rounded-lg border px-4 py-2 pr-11 transition-colors',
            'focus:outline-none focus:ring-2',
            error
              ? 'border-red-500 focus:ring-red-500'
              : 'border-zinc-300 focus:border-sky-500 focus:ring-sky-500',
          ].join(' ')}
          placeholder="请输入密码"
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? 'password-error' : undefined}
        />
        <button
          type="button"
          onClick={onToggleVisibility}
          className="absolute top-1/2 right-3 -translate-y-1/2 text-sm text-zinc-500 transition-colors hover:text-zinc-700"
          aria-label={isVisible ? '隐藏密码' : '显示密码'}
        >
          {isVisible ? '隐藏' : '显示'}
        </button>
      </div>
      {error ? (
        <p id="password-error" className="text-sm text-red-500">
          {error}
        </p>
      ) : null}
    </div>
  )
}
