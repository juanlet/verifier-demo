export interface Check {
    id: string,
    priority: number,
    description: string,
    disabled?: boolean,
    answer?: boolean | null
}

export interface Result {
    checkId: string
    result: boolean
}

export interface Results {
    results: Result[]
}

export interface FetchError {
    success: false;
}
