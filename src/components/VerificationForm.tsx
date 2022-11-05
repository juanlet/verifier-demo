import { useEffect, useState } from 'react'
import { fetchChecks } from '../services/api'
import { Check, FetchError } from '../types/interfaces'
import { Checks } from '../types/types'
import Button from './Button'
import verificationFormStyles from './VerificationForm.module.css'
import buttonStyles from './Button.module.css'

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
        checks.forEach((check, index) => {
            formattedSortedChecks.push({ id: check.id, description: check.description, disabled: index === 0 ? false : true, answer: null, priority: check.priority })
        })

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
        const { id } = checkElement
        const clickedElementIndex = formState.findIndex(check => check.id === id)
        // we copy the formState to avoid mutation
        const updatedFormState = [...formState]
        // update the clicked item to have the answer property
        updatedFormState[clickedElementIndex]!.answer = isYesAnswer
        const isNoAnswer = !isYesAnswer
        if (isNoAnswer) {
            // update all the checks after the clicked one to be disabled
            for (let i = clickedElementIndex + 1; i < updatedFormState.length; i++) {
                updatedFormState[i]!.disabled = true
            }
        } else {
            // update the next check to be enabled
            if (clickedElementIndex + 1 < updatedFormState.length) {
                updatedFormState[clickedElementIndex + 1]!.disabled = false
            }
        }
        // update the formState with the copy of the formState
        setFormState(updatedFormState)
    }

    if (error) {
        return <div className={verificationFormStyles.errorContainer} onClick={() => setError(null)}>{error}<Button disabled={false}>Retry</Button></div>
    }

    return (
        <form onSubmit={onSubmitVerificationHandler}>
            <div className={verificationFormStyles.formFieldsContainer}>
                {formState.map((checkElement) => {
                    // we cast description to these two values, any other value would be a bug
                    const { id, description, disabled, answer } = checkElement;
                    // this will determine if the button has the selected style or not
                    const buttonExtraStyle = answer ? buttonStyles.ButtonSelected : ''
                    console.log("ANS", answer)
                    return (
                        <div key={id} className={`${verificationFormStyles.ButtonGroupContainer} ${disabled ? verificationFormStyles.noHighlight : ''}`} aria-labelledby={description ?? 'Verification field'}>
                            <h3 className={disabled ? verificationFormStyles.disabledText : ''}>{description}</h3>
                            <div className={verificationFormStyles.ButtonGroup}>
                                <Button type="button" onClick={() => onOptionBtnClickHandler({ checkElement, isYesAnswer: true })} disabled={disabled} classes={answer ? buttonExtraStyle : ''}>Yes</Button>
                                <Button type="button" onClick={() => onOptionBtnClickHandler({ checkElement, isYesAnswer: false })} disabled={disabled} classes={answer ? '' : buttonExtraStyle}>No</Button>
                            </div>
                        </div>
                    )
                })}
            </div >
            <div style={{ textAlign: "end" }}><Button type="submit">Submit</Button></div>

        </form >
    )
}
