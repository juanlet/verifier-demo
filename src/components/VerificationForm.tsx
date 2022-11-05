import { useEffect, useState } from 'react'
import { fetchChecks } from '../services/api'
import { FetchError } from '../types/interfaces'
import { Checks } from '../types/types'
import Button from './Button'
import styles from './VerificationForm.module.css'

type VerificationFormState = Map<String, { description: String, answer: String | null, priority: number }>

const sortChecksByPriority = (checks: Checks) => {
    // avoid mutation of the original checks, sort checks by priority in ascending order
    const checkCopy = [...checks]
    return checkCopy.sort((a, b) => a.priority - b.priority)
}

const isErrorChecksResponse = (checks: Checks | FetchError) => {
    // if success property is present in the response as a key, it means there was an error according to the specification of the given API
    if ('success' in checks) {
        throw new Error()
    }
}


export default function VerificationForm() {
    const [formState, setFormState] = useState<VerificationFormState | {}>({})
    const [error, setError] = useState<string | null>(null)

    const buildFieldMap = (sortedChecks: Checks) => {
        const generatedFormFieldsMap: VerificationFormState = {} as VerificationFormState
        for (const check of sortedChecks) {
            generatedFormFieldsMap.set(check.id, { description: check.description, answer: null, priority: check.priority })
        }

        setFormState(generatedFormFieldsMap)
    }

    const fetchInitialVerificationData = async () => {
        try {
            const fetchResult: Checks | FetchError = await fetchChecks()
            isErrorChecksResponse(fetchResult)
            const sortedChecks = sortChecksByPriority(fetchResult as Checks)
            buildFieldMap(sortedChecks)
        } catch {
            setError("There was an error with the service. Please wait a few minutes before you try again.")
        }
    }

    useEffect(() => {
        fetchInitialVerificationData()
    }, [])

    useEffect(() => {
        // this effect is used when there's a fetch error and the user press the retry fetch button
        if (!error && (formState as VerificationFormState).size) {
            fetchInitialVerificationData()
        }
    }, [error])

    const onSubmitVerificationHandler = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        console.log("submit")
    }

    const onOptionBtnClickHandler = () => {
        console.log("button clicked")
    }

    if (error) {
        return <div className={styles.errorContainer} onClick={() => setError(null)}>{error}<Button>Retry</Button></div>
    }

    return (
        <form onSubmit={onSubmitVerificationHandler}>
            <div className={styles.formFieldsContainer}>
                {Object.keys(formState).map((formFieldName) => {
                    return (
                        <div key={formFieldName} className={styles.ButtonGroupContainer} aria-label={formFieldName}>
                            <h3>{formFieldName}</h3>
                            <div className={styles.ButtonGroup}>
                                <Button type="button" onClick={onOptionBtnClickHandler}>Yes</Button>
                                <Button type="button" onClick={onOptionBtnClickHandler}>No</Button>
                            </div>
                        </div>
                    )
                })}
            </div>
            <div style={{ textAlign: "end" }}><Button type="submit">Submit</Button></div>

        </form>
    )
}
