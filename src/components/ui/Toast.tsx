'use client'

interface ToastProps {
  message: string
  type: 'success' | 'error'
}

export function Toast({ message, type }: ToastProps) {
  if (!message) {
    return null
  }

  const isSuccess = type === 'success'

  return (
    <div
      className={[
        'fixed top-4 left-1/2 z-50 -translate-x-1/2 rounded-lg px-6 py-3 shadow-lg',
        'font-medium text-white transition-all duration-300',
        isSuccess ? 'bg-green-600' : 'bg-red-600',
      ].join(' ')}
      role={isSuccess ? 'status' : 'alert'}
      aria-live="polite"
    >
      {message}
    </div>
  )
}
