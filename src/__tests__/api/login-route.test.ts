/** @jest-environment node */

import { POST } from '@/app/api/login/route'

describe('POST /api/login', () => {
  const originalSecret = process.env.JWT_SECRET

  beforeEach(() => {
    process.env.JWT_SECRET = 'test-secret'
  })

  afterEach(() => {
    process.env.JWT_SECRET = originalSecret
  })

  it('should return 200 and set auth cookie for valid credentials', async () => {
    const request = new Request('http://localhost:3000/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: 'admin',
        password: '123456',
      }),
    })

    const response = await POST(request)
    const body = await response.json()

    expect(response.status).toBe(200)
    expect(body).toEqual({
      success: true,
      user: {
        username: 'admin',
      },
    })
    expect(response.headers.get('set-cookie')).toContain('auth_token=')
    expect(response.headers.get('set-cookie')).toContain('HttpOnly')
  })

  it('should return 401 for invalid credentials', async () => {
    const request = new Request('http://localhost:3000/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: 'admin',
        password: 'wrong-password',
      }),
    })

    const response = await POST(request)
    const body = await response.json()

    expect(response.status).toBe(401)
    expect(body).toEqual({
      success: false,
      message: '用户名或密码错误',
    })
  })

  it('should return 400 when username or password is empty', async () => {
    const request = new Request('http://localhost:3000/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: '',
        password: '',
      }),
    })

    const response = await POST(request)
    const body = await response.json()

    expect(response.status).toBe(400)
    expect(body).toEqual({
      success: false,
      message: '用户名和密码不能为空',
    })
  })

  it('should return 500 when JWT_SECRET is missing', async () => {
    delete process.env.JWT_SECRET

    const request = new Request('http://localhost:3000/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: 'admin',
        password: '123456',
      }),
    })

    const response = await POST(request)
    const body = await response.json()

    expect(response.status).toBe(500)
    expect(body).toEqual({
      success: false,
      message: '服务暂时不可用，请稍后重试',
    })
  })
})
