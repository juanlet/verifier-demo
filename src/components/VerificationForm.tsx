import { useEffect, useState } from 'react'
import { fetchChecks } from '../services/api'
import { Check, FetchError } from '../types/interfaces'
import { Checks } from '../types/types'
import Button from './Button'
import styles from './VerificationForm.module.css'

const sortChecksByPriority = (checks: Checks) => {
    // avoid mutation of the original checks, sort checks by priority in ascending order
    const checkCopy = [...checks]
    return checkCopy.sort((a, b) => a.priority - b.priority)
}

const isFetchError = (checks: Checks | FetchError) => {
    // if success property is present in the response as a key, it means there was an error according to the specification of the given API
    if ('success' in checks) {
        throw new Error()
    }
}

export default function VerificationForm() {
    const [formState, setFormState] = useState<Checks>(() => [])
    const [error, setError] = useState<string | null>(null)

    const completeChecksWithStatusFields = (checks: Checks) => {
        const formattedSortedChecks: Checks = []
        for (const check of checks) {
            formattedSortedChecks.push({ id: check.id, description: check.description, disabled: true, answer: null, priority: check.priority })
        }

        setFormState(formattedSortedChecks)
    }

    const fetchInitialVerificationData = async () => {
        try {
            const fetchResult: Checks | FetchError = await fetchChecks()
            isFetchError(fetchResult)
            const checks = fetchResult as Checks
            const sortedChecks = sortChecksByPriority(checks)
            completeChecksWithStatusFields(sortedChecks)
        } catch {
            setError("There was an error with the service. Please wait a few minutes before you try again.")
        }
    }

    useEffect(() => {
        fetchInitialVerificationData()
    }, [])

    useEffect(() => {
        // this effect is used when there's a fetch error and the user press the retry fetch button
        if (!error && formState.length) {
            fetchInitialVerificationData()
        }
    }, [error])

    const onSubmitVerificationHandler = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        console.log("submit")
    }

    const onOptionBtnClickHandler = ({ checkElement, isYesAnswer }: { checkElement: Check, isYesAnswer: boolean }) => {
        const { id, answer: currentAnswer } = checkElement
        if (!currentAnswer) {
            formState.find(check => check.id === id)!.answer = isYesAnswer
            return
        }
    }

    if (error) {
        return <div className={styles.errorContainer} onClick={() => setError(null)}>{error}<Button>Retry</Button></div>
    }

    return (
        <form onSubmit={onSubmitVerificationHandler}>
            <div className={styles.formFieldsContainer}>
                {formState.map((checkElement) => {
                    // we cast description to these two values, any other value would be a bug
                    const { id, description } = checkElement;
                    return (
                        <div key={id} className={styles.ButtonGroupContainer} aria-labelledBy={description ?? 'Verification field'}>
                            <h3>{description}</h3>
                            <div className={styles.ButtonGroup}>
                                <Button type="button" onClick={() => onOptionBtnClickHandler({ checkElement, isYesAnswer: true })}>Yes</Button>
                                <Button type="button" onClick={() => onOptionBtnClickHandler({ checkElement, isYesAnswer: false })}>No</Button>
                            </div>
                        </div>
                    )
                })}
            </div >
            <div style={{ textAlign: "end" }}><Button type="submit">Submit</Button></div>

        </form >
    )
}
