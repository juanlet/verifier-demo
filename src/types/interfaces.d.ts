export interface Check {
    id: string,
    priority: number,
    description: string,
    disabled?: boolean,
    answer?: boolean | null
}


export interface FetchError {
    success: false;
}
