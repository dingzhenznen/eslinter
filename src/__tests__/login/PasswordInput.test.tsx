import { fireEvent, render, screen } from '@testing-library/react'

import { PasswordInput } from '@/components/login/PasswordInput'

describe('PasswordInput', () => {
  const defaultProps = {
    value: '',
    onChange: jest.fn(),
    error: undefined,
    isVisible: false,
    onToggleVisibility: jest.fn(),
  }

  it('should render password input', () => {
    render(<PasswordInput {...defaultProps} />)

    expect(screen.getByLabelText('密码')).toBeInTheDocument()
  })

  it('should use password type by default', () => {
    render(<PasswordInput {...defaultProps} />)

    expect(screen.getByLabelText('密码')).toHaveAttribute('type', 'password')
  })

  it('should use text type when visible', () => {
    render(<PasswordInput {...defaultProps} isVisible />)

    expect(screen.getByLabelText('密码')).toHaveAttribute('type', 'text')
  })

  it('should call onChange when input changes', () => {
    const onChange = jest.fn()

    render(<PasswordInput {...defaultProps} onChange={onChange} />)

    fireEvent.change(screen.getByLabelText('密码'), {
      target: { value: 'password123' },
    })

    expect(onChange).toHaveBeenCalledWith('password123')
  })

  it('should call onToggleVisibility when button is clicked', () => {
    const onToggleVisibility = jest.fn()

    render(
      <PasswordInput
        {...defaultProps}
        onToggleVisibility={onToggleVisibility}
      />,
    )

    fireEvent.click(screen.getByRole('button'))

    expect(onToggleVisibility).toHaveBeenCalledTimes(1)
  })

  it('should display the error message', () => {
    render(<PasswordInput {...defaultProps} error="密码错误" />)

    expect(screen.getByText('密码错误')).toBeInTheDocument()
  })

  it('should mark the input invalid when there is an error', () => {
    render(<PasswordInput {...defaultProps} error="有错误" />)

    expect(screen.getByLabelText('密码')).toHaveAttribute('aria-invalid', 'true')
  })
})
