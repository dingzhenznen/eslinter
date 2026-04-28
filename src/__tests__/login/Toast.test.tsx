import { render, screen } from '@testing-library/react'

import { Toast } from '@/components/ui/Toast'

describe('Toast', () => {
  it('should not render when message is empty', () => {
    const { container } = render(<Toast message="" type="success" />)

    expect(container.firstChild).toBeNull()
  })

  it('should render success message', () => {
    render(<Toast message="登录成功" type="success" />)

    expect(screen.getByText('登录成功')).toBeInTheDocument()
  })

  it('should render error message', () => {
    render(<Toast message="登录失败" type="error" />)

    expect(screen.getByText('登录失败')).toBeInTheDocument()
  })

  it('should have status role for success', () => {
    render(<Toast message="成功" type="success" />)

    expect(screen.getByRole('status')).toBeInTheDocument()
  })

  it('should have alert role for error', () => {
    render(<Toast message="错误" type="error" />)

    expect(screen.getByRole('alert')).toBeInTheDocument()
  })
})
