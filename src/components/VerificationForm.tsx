import { SyntheticEvent, useCallback, useEffect, useState } from 'react'
import { fetchChecks, isResponseError, submitCheckResults } from '@/services/api'
import { Check, FetchError } from '@/types/interfaces'
import { Checks, UseStateNumberType } from '@/types/types'
import Button from '@/components/Button'
import verificationFormStyles from '@/components/VerificationForm.module.css'
import '@/components/VerificationForm.module.css'
import buttonStyles from '@/components/Button.module.css'
import { useNavigate } from 'react-router-dom'
import { useKey } from 'react-use'

/* extracted functions from component and exported them and injected the dependencies
for these to be easily testable. I left them here to be closer to the code but they can be put in a utils file if needed */

export const sortChecksByPriority = (checks: Checks) => {
    // avoid mutation of the original checks, sort checks by priority in ascending order
    const checkCopy = [...checks]
    return checkCopy.sort((a, b) => a.priority - b.priority)
}

export const getCheckIndexById = (checks: Checks, id: string) => checks.findIndex(check => check.id === id)

export const areAllAnswersYes = (checks: Checks) => checks.length > 0 && checks.every(field => field.answer === true)

export const haveAtLeastOneNoAnswer = (checks: Checks) => checks.length > 0 && checks.some(field => field.answer === false)

export const isSubmitDisabled = (checks: Checks) => {
    const disableSubmit = !areAllAnswersYes(checks) && !haveAtLeastOneNoAnswer(checks)
    return disableSubmit
}

export const formatRawCheckItems = (checks: Checks) => {
    const formattedSortedChecks: Checks = []
    checks.forEach((check, index) => {
        const formattedCheck = {
            id: check.id,
            description: check.description,
            disabled: index !== 0,
            answer: null,
            priority: check.priority
        }
        formattedSortedChecks.push(formattedCheck)
    })
    return formattedSortedChecks
}

export const disableFollowingCheckIndexes = (checks: Checks, disableStartingIndex: number) => {
    for (let i = disableStartingIndex + 1; i < checks.length; i++) {
        checks[i].disabled = true
        checks[i].answer = null
    }

    return checks
}

export const enableNextCheck = (checks: Checks, checkIndex: number) => {
    if (checkIndex + 1 < checks.length) {
        checks[checkIndex + 1].disabled = false
    }

    return checks
}

export default function VerificationForm() {
    const [checks, setChecks] = useState<Checks>(() => [])
    const [fetchError, setFetchError] = useState<string | null>(null)
    const [submitError, setSubmitError] = useState<string | null>(null)
    const [activeCheckIndex, setActiveCheckIndex] = useState<number>(0)
    // list of refs to navigate through the checks and show the active check
    const navigate = useNavigate()

    const moveCursorUp = (e: SyntheticEvent) => {
        e.preventDefault()
        const previousCheckIndex = activeCheckIndex - 1
        if (previousCheckIndex >= 0) {
            setActiveCheckIndex(activeCheckIndex => activeCheckIndex - 1)
        }
    }

    const moveCursorDown = (e: SyntheticEvent) => {
        e.preventDefault()
        const lastCheckIndex = checks.length - 1
        const nextCheckIndex = activeCheckIndex + 1
        if (nextCheckIndex <= lastCheckIndex && !checks[nextCheckIndex].disabled) {
            setActiveCheckIndex(activeCheckIndex => activeCheckIndex + 1)
        }
    }

    const moveCursorToYesNoOption = (checks: Checks, selectedOption: string) => {
        if (!checks.length) return
        // create a copy of checks array
        const checksCopy = [...checks]
        checksCopy[activeCheckIndex].answer = selectedOption === "yes"
        setChecks(checksCopy)
        if (selectedOption === "yes") {
            enableNextCheck(checksCopy, activeCheckIndex)
            setActiveCheckIndex(activeCheckIdx => activeCheckIdx + 1)
        } else {
            disableFollowingCheckIndexes(checksCopy, activeCheckIndex)
            setActiveCheckIndex(activeCheckIndex)
        }
    }

    // setting key listeners for up, down, yes and no to navigate through the checks
    useKey('ArrowUp', (moveCursorUp as any), {}, [activeCheckIndex])
    useKey('ArrowDown', (moveCursorDown as any), {}, [activeCheckIndex])
    useKey('1', () => moveCursorToYesNoOption(checks, "yes"), {}, [checks, activeCheckIndex])
    useKey('2', () => moveCursorToYesNoOption(checks, "no"), {}, [checks, activeCheckIndex])


    const fetchInitialVerificationData = async () => {
        try {
            const fetchResult: Checks | FetchError = await fetchChecks()
            isResponseError(fetchResult)
            const checks = fetchResult as Checks
            const sortedChecks = sortChecksByPriority(checks)
            const formattedChecks = formatRawCheckItems(sortedChecks)
            setChecks(formattedChecks)
        } catch {
            setFetchError("There was an error with the service. Please wait a few minutes before you try again.")
        }
    }

    useEffect(() => {
        fetchInitialVerificationData()
    }, [])

    useEffect(() => {
        // this effect is used when there's a fetch error and the user press the retry fetch button
        if (!fetchError && checks.length) {
            fetchInitialVerificationData()
        }
    }, [fetchError])


    const updateCheckSelectedOption = (checks: Checks, checkIndex: number, isYesAnswer: boolean) => {
        checks[checkIndex].answer = isYesAnswer
        setActiveCheckIndex(checkIndex)
    }

    const onOptionBtnClickHandler = ({ checkElement, isYesAnswer }: { checkElement: Check, isYesAnswer: boolean }) => {
        // user clicks on a yes/no option
        const { id } = checkElement
        const clickedElementIndex = getCheckIndexById(checks, id)
        // we copy the checks to avoid mutation
        const updatedChecksState = [...checks]
        // update the clicked item to have the answer property
        updateCheckSelectedOption(updatedChecksState, clickedElementIndex, isYesAnswer)
        const isNoAnswer = !isYesAnswer
        if (isNoAnswer) {
            // update all the checks after the clicked one to be disabled
            disableFollowingCheckIndexes(updatedChecksState, clickedElementIndex)
            setActiveCheckIndex(clickedElementIndex)
        } else {
            // update the next check to be enabled
            enableNextCheck(updatedChecksState, clickedElementIndex)
            setActiveCheckIndex(activeCheckIdx => activeCheckIdx + 1)
        }
        // update the checks with the copy of the checks
        setChecks(updatedChecksState)
    }

    if (fetchError) {
        return <div className={verificationFormStyles.errorContainer} onClick={() => setFetchError(null)}>{fetchError}<Button disabled={false}>Retry</Button></div>
    }

    const onSubmitVerificationHandler = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        try {
            setSubmitError(null)
            const checkResults = await submitCheckResults(checks)
            isResponseError(checkResults)
            navigate("/success")
        } catch (error) {
            setSubmitError("There was an error submitting the check results")
        }
    }

    return (
        <form onSubmit={onSubmitVerificationHandler}>
            <div className={verificationFormStyles.formFieldsContainer}>
                {checks.map((checkElement, idx) => {
                    // we cast description to these two values, any other value would be a bug
                    const { id, description, disabled, answer } = checkElement
                    // this will determine if the button has the selected style or not
                    const removeHoverOnDisabled = `${disabled ? verificationFormStyles.noHighlight : ''}`
                    const activeClass = idx === activeCheckIndex && !disabled ? verificationFormStyles.active : ''
                    const classes = `${verificationFormStyles.ButtonGroupContainer} 
                                     ${removeHoverOnDisabled}
                                     ${activeClass}`
                    return (
                        <div key={id} className={classes} aria-labelledby={description ?? 'Verification field'}>
                            <h3 className={disabled ? verificationFormStyles.disabledText : ''}>{description}</h3>
                            <div className={verificationFormStyles.ButtonGroup}>
                                <Button id={`yesBtn-${idx}`} type="button" onClick={() => onOptionBtnClickHandler({ checkElement, isYesAnswer: true })} disabled={disabled} classes={answer ? buttonStyles.ButtonSelected : ''}>Yes</Button>
                                <Button id={`noBtn-${idx}`} type="button" onClick={() => onOptionBtnClickHandler({ checkElement, isYesAnswer: false })} disabled={disabled} classes={answer ? '' : answer !== null ? buttonStyles.ButtonSelected : ''}>No</Button>
                            </div>
                        </div>
                    )
                })}
            </div >
            {submitError ? <div className={verificationFormStyles.ErrorAlert}>{submitError}</div> : null}
            <div style={{ textAlign: "end" }}><Button type="submit" disabled={isSubmitDisabled(checks)}>Submit</Button></div>

        </form >
    )
}
