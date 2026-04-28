import { fireEvent, render, screen, waitFor } from '@testing-library/react'

import { LoginForm } from '@/components/login/LoginForm'

const fetchMock = jest.fn()

describe('LoginForm', () => {
  beforeEach(() => {
    fetchMock.mockReset()
    global.fetch = fetchMock as typeof fetch
  })

  it('should render all form fields', () => {
    render(<LoginForm />)

    expect(screen.getByLabelText('用户名')).toBeInTheDocument()
    expect(screen.getByLabelText('密码')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '登录' })).toBeInTheDocument()
  })

  it('should show validation errors when submitted empty', async () => {
    render(<LoginForm />)

    fireEvent.click(screen.getByRole('button', { name: '登录' }))

    expect(await screen.findByText('请输入用户名')).toBeInTheDocument()
    expect(await screen.findByText('请输入密码')).toBeInTheDocument()
  })

  it('should show loading state during submission', async () => {
    let resolveRequest: (() => void) | undefined

    fetchMock.mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveRequest = () => {
            resolve({
              ok: true,
              json: async () => ({
                success: true,
                user: {
                  username: 'admin',
                },
              }),
            })
          }
        }),
    )

    render(<LoginForm onSuccess={() => {}} />)

    fireEvent.change(screen.getByLabelText('用户名'), {
      target: { value: 'admin' },
    })
    fireEvent.change(screen.getByLabelText('密码'), {
      target: { value: '123456' },
    })
    fireEvent.click(screen.getByRole('button', { name: '登录' }))

    expect(await screen.findByText('登录中...')).toBeInTheDocument()

    resolveRequest?.()

    await waitFor(() => {
      expect(screen.getByRole('button', { name: '登录' })).toBeInTheDocument()
    })
  })

  it('should call /api/login with credentials', async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => ({
        success: true,
        user: {
          username: 'admin',
        },
      }),
    })

    render(<LoginForm onSuccess={() => {}} />)

    fireEvent.change(screen.getByLabelText('用户名'), {
      target: { value: 'admin' },
    })
    fireEvent.change(screen.getByLabelText('密码'), {
      target: { value: '123456' },
    })
    fireEvent.click(screen.getByRole('button', { name: '登录' }))

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: 'admin',
          password: '123456',
        }),
      })
    })
  })

  it('should show success toast after successful login', async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => ({
        success: true,
        user: {
          username: 'admin',
        },
      }),
    })

    render(<LoginForm onSuccess={() => {}} />)

    fireEvent.change(screen.getByLabelText('用户名'), {
      target: { value: 'admin' },
    })
    fireEvent.change(screen.getByLabelText('密码'), {
      target: { value: '123456' },
    })
    fireEvent.click(screen.getByRole('button', { name: '登录' }))

    expect(await screen.findByText('登录成功')).toBeInTheDocument()
  })

  it('should show server error message after failed login', async () => {
    fetchMock.mockResolvedValue({
      ok: false,
      json: async () => ({
        success: false,
        message: '用户名或密码错误',
      }),
    })

    render(<LoginForm />)

    fireEvent.change(screen.getByLabelText('用户名'), {
      target: { value: 'admin' },
    })
    fireEvent.change(screen.getByLabelText('密码'), {
      target: { value: 'wrong-password' },
    })
    fireEvent.click(screen.getByRole('button', { name: '登录' }))

    expect(await screen.findByText('用户名或密码错误')).toBeInTheDocument()
  })
})
