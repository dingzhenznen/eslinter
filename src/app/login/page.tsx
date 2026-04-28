'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'

import { LoginForm } from '@/components/login/LoginForm'

export default function LoginPage() {
  const router = useRouter()

  const handleSuccess = () => {
    router.push('/')
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[linear-gradient(180deg,#f7fbff_0%,#eef4ff_45%,#f5efe6_100%)] px-4 py-12">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(14,165,233,0.16),_transparent_38%),radial-gradient(circle_at_bottom,_rgba(251,146,60,0.18),_transparent_32%)]" />

      <div className="relative w-full max-w-md">
        <section className="rounded-[28px] border border-white/70 bg-white/85 p-8 shadow-[0_30px_90px_rgba(15,23,42,0.14)] backdrop-blur">
          <div className="mb-8 space-y-3 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-sky-600">
              Welcome Back
            </p>
            <h1 className="text-3xl font-semibold tracking-tight text-zinc-900">
              欢迎回来
            </h1>
            <p className="text-sm leading-6 text-zinc-500">请登录您的账户</p>
          </div>

          <LoginForm onSuccess={handleSuccess} />

          <div className="mt-6 text-center">
            <Link
              href="#"
              className="text-sm font-medium text-sky-700 transition-colors hover:text-sky-900"
            >
              忘记密码？
            </Link>
          </div>
        </section>

        <p className="mt-5 text-center text-sm text-zinc-500">
          测试账号: <span className="font-medium text-zinc-700">admin / 123456</span>
        </p>
      </div>
    </main>
  )
}
