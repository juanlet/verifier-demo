import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { describe, expect, it } from "vitest"
import Button from '@/components/Button'

describe('Button', () => {
    it('renders a button', () => {
        render(<Button>submit</Button>)
        expect(screen.getByRole('button')).toBeInTheDocument()
    })

    it('renders a button with the correct text', () => {
        render(<Button>submit</Button>)
        expect(screen.getByRole('button')).toHaveTextContent('submit')
    })

    it('renders a non clickable button when disabled property is set', () => {
        render(<Button disabled={true}>submit</Button>)
        // returns empty string if the disable attribute exists
        expect(screen.getByText('submit').getAttribute('disabled')).toBe('')
    })
})
