import { FetchError } from "@/types/interfaces"
import { Checks } from "@/types/types"

export const checkList = [
    {
        id: "aaa",
        priority: 10,
        description: "Face on the picture matches face on the document"
    },
    {
        id: "bbb",
        priority: 5,
        description: "Veriff supports presented document"
    },
    {
        id: "ccc",
        priority: 7,
        description: "Face is clearly visible"
    },
    {
        id: "ddd",
        priority: 3,
        description: "Document data is clearly visible"
    }
]

export function fetchChecks(): Promise<Checks | FetchError> {
    return new Promise((resolve, reject) =>
        setTimeout(
            () =>
                Math.random() <= 0.99
                    ? resolve(checkList)
                    : reject({ success: false }),
            500
        )
    )
}

export function submitCheckResults(results: Checks): Promise<Checks | FetchError> {
    return new Promise((resolve, reject) =>
        setTimeout(
            () =>
                Math.random() <= 0.8 ? resolve(results) : reject({ success: false }),
            500
        )
    )
}

export const isResponseError = (checks: Checks | FetchError) => {
    // if success property is present in the response as a key, it means there was an error according to the specification of the given API
    if ('success' in checks) {
        throw new Error()
    }
}
