export class Check {
    id: string
    priority: number
    description: string
    disabled?: boolean | null | undefined
    answer?: boolean | null | undefined

    constructor(id: string, priority: number, description: string, disabled?: boolean, answer?: boolean) {
        this.id = id
        this.priority = priority
        this.description = description
        this.disabled = disabled
        this.answer = answer ?? null
    }

    get id() {
        return this.id
    }

    get priority() {
        return this.priority
    }

    get description() {
        return this.description
    }

    get disabled() {
        return this.disabled as boolean
    }

    get answer() {
        return this.answer
    }

    set id(id: string) {
        this.id = id
    }

    set disabled(disabled: boolean) {
        this.disabled = disabled
    }

    set answer(answer: boolean | null) {
        this.answer = answer
    }
}
