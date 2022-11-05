import { useCallback, useEffect, useState } from 'react'
import { fetchChecks, submitCheckResults } from '@/services/api'
import { Check, FetchError } from '@/types/interfaces'
import { Checks } from '@/types/types'
import Button from '@/components/Button'
import verificationFormStyles from '@/components/VerificationForm.module.css'
import buttonStyles from '@/components/Button.module.css'
import { useNavigate } from 'react-router-dom'

const sortChecksByPriority = (checks: Checks) => {
    // avoid mutation of the original checks, sort checks by priority in ascending order
    const checkCopy = [...checks]
    return checkCopy.sort((a, b) => a.priority - b.priority)
}

const isResponseError = (checks: Checks | FetchError) => {
    // if success property is present in the response as a key, it means there was an error according to the specification of the given API
    if ('success' in checks) {
        throw new Error()
    }
}

export default function VerificationForm() {
    const [formState, setFormState] = useState<Checks>(() => [])
    const [fetchError, setFetchError] = useState<string | null>(null)
    const [submitError, setSubmitError] = useState<string | null>(null)
    const navigate = useNavigate()

    const completeChecksWithStatusFields = (checks: Checks) => {
        const formattedSortedChecks: Checks = []
        checks.forEach((check, index) => {
            formattedSortedChecks.push({ id: check.id, description: check.description, disabled: index !== 0, answer: null, priority: check.priority })
        })

        setFormState(formattedSortedChecks)
    }

    const fetchInitialVerificationData = async () => {
        try {
            const fetchResult: Checks | FetchError = await fetchChecks()
            isResponseError(fetchResult)
            const checks = fetchResult as Checks
            const sortedChecks = sortChecksByPriority(checks)
            completeChecksWithStatusFields(sortedChecks)
        } catch {
            setFetchError("There was an error with the service. Please wait a few minutes before you try again.")
        }
    }

    useEffect(() => {
        fetchInitialVerificationData()
    }, [])

    useEffect(() => {
        // this effect is used when there's a fetch error and the user press the retry fetch button
        if (!fetchError && formState.length) {
            fetchInitialVerificationData()
        }
    }, [fetchError])

    const onSubmitVerificationHandler = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        try {
            setSubmitError(null)
            const checkResults = await submitCheckResults(formState)
            isResponseError(checkResults)
            navigate("/success")
        } catch (error) {
            setSubmitError("There was an error submitting the check results")
        }
    }

    const disableNextChecks = (formState: Checks, disableStartingIndex: number) => {
        for (let i = disableStartingIndex + 1; i < formState.length; i++) {
            formState[i].disabled = true
            formState[i].answer = null
        }
    }

    const enableNextCheck = (formState: Checks, clickedElementIndex: number) => {
        if (clickedElementIndex + 1 < formState.length) {
            formState[clickedElementIndex + 1].disabled = false
        }
    }

    const getCheckIndexById = (formState: Checks, id: string) => formState.findIndex(check => check.id === id)

    const updateCheckSelectedOption = (formState: Checks, checkIndex: number, isYesAnswer: boolean) => { formState[checkIndex].answer = isYesAnswer }

    const onOptionBtnClickHandler = useCallback(({ checkElement, isYesAnswer }: { checkElement: Check, isYesAnswer: boolean }) => {
        const { id } = checkElement
        const clickedElementIndex = getCheckIndexById(formState, id)
        // we copy the formState to avoid mutation
        const updatedFormState = [...formState]
        // update the clicked item to have the answer property
        updateCheckSelectedOption(updatedFormState, clickedElementIndex, isYesAnswer)
        const isNoAnswer = !isYesAnswer
        if (isNoAnswer) {
            // update all the checks after the clicked one to be disabled
            disableNextChecks(updatedFormState, clickedElementIndex)
        } else {
            // update the next check to be enabled
            enableNextCheck(updatedFormState, clickedElementIndex)
        }
        // update the formState with the copy of the formState
        setFormState(updatedFormState)
    }, [formState])

    if (fetchError) {
        return <div className={verificationFormStyles.errorContainer} onClick={() => setFetchError(null)}>{fetchError}<Button disabled={false}>Retry</Button></div>
    }

    return (
        <form onSubmit={onSubmitVerificationHandler}>
            <div className={verificationFormStyles.formFieldsContainer}>
                {formState.map((checkElement) => {
                    // we cast description to these two values, any other value would be a bug
                    const { id, description, disabled, answer } = checkElement
                    // this will determine if the button has the selected style or not
                    console.log("ANS", answer)
                    return (
                        <div key={id} className={`${verificationFormStyles.ButtonGroupContainer} ${disabled ? verificationFormStyles.noHighlight : ''}`} aria-labelledby={description ?? 'Verification field'}>
                            <h3 className={disabled ? verificationFormStyles.disabledText : ''}>{description}</h3>
                            <div className={verificationFormStyles.ButtonGroup}>
                                <Button type="button" onClick={() => onOptionBtnClickHandler({ checkElement, isYesAnswer: true })} disabled={disabled} classes={answer ? buttonStyles.ButtonSelected : ''}>Yes</Button>
                                <Button type="button" onClick={() => onOptionBtnClickHandler({ checkElement, isYesAnswer: false })} disabled={disabled} classes={answer ? '' : answer !== null ? buttonStyles.ButtonSelected : ''}>No</Button>
                            </div>
                        </div>
                    )
                })}
            </div >
            {submitError ? <div className={verificationFormStyles.ErrorAlert}>{submitError}</div> : null}
            <div style={{ textAlign: "end" }}><Button type="submit" disabled={!formState.every(field => field.answer === true)}>Submit</Button></div>

        </form >
    )
}
