import jwt from 'jsonwebtoken'
import { NextResponse } from 'next/server'

const VALID_USERNAME = 'admin'
const VALID_PASSWORD = '123456'
const COOKIE_NAME = 'auth_token'
const SEVEN_DAYS_IN_SECONDS = 60 * 60 * 24 * 7

interface LoginRequestBody {
  username?: string
  password?: string
}

export async function POST(request: Request) {
  const { username, password } = (await request.json()) as LoginRequestBody

  if (!username || !password) {
    return NextResponse.json(
      {
        success: false,
        message: '用户名和密码不能为空',
      },
      { status: 400 },
    )
  }

  if (username !== VALID_USERNAME || password !== VALID_PASSWORD) {
    return NextResponse.json(
      {
        success: false,
        message: '用户名或密码错误',
      },
      { status: 401 },
    )
  }

  const secret = process.env.JWT_SECRET

  if (!secret) {
    return NextResponse.json(
      {
        success: false,
        message: '服务暂时不可用，请稍后重试',
      },
      { status: 500 },
    )
  }

  const token = jwt.sign({ username }, secret, {
    expiresIn: '7d',
  })

  const response = NextResponse.json({
    success: true,
    user: {
      username,
    },
  })

  response.cookies.set({
    name: COOKIE_NAME,
    value: token,
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    secure: process.env.NODE_ENV === 'production',
    maxAge: SEVEN_DAYS_IN_SECONDS,
  })

  return response
}
