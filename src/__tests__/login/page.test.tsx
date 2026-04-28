import { render, screen } from '@testing-library/react'

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}))

import LoginPage from '@/app/login/page'

describe('LoginPage', () => {
  it('should render the login heading and description', () => {
    render(<LoginPage />)

    expect(screen.getByText('欢迎回来')).toBeInTheDocument()
    expect(screen.getByText('请登录您的账户')).toBeInTheDocument()
  })

  it('should render the login form', () => {
    render(<LoginPage />)

    expect(screen.getByLabelText('用户名')).toBeInTheDocument()
    expect(screen.getByLabelText('密码')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '登录' })).toBeInTheDocument()
  })

  it('should render the forgot password link', () => {
    render(<LoginPage />)

    expect(screen.getByText('忘记密码？')).toBeInTheDocument()
  })

  it('should render the test account hint', () => {
    render(<LoginPage />)

    expect(screen.getByText(/测试账号:/i)).toBeInTheDocument()
  })
})
