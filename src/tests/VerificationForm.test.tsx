import VerificationForm, { areAllAnswersYes, disableFollowingCheckIndexes, enableNextCheck, formatRawCheckItems, getCheckIndexById, haveAtLeastOneNoAnswer, isSubmitDisabled, sortChecksByPriority } from "@/components/VerificationForm"
import { describe, expect, it, vi } from "vitest"
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { Check } from "@/classes/Check"

vi.mock("react-router-dom", () => {
    return { useNavigate: vi.fn() }
})

describe('verification form', () => {
    describe('Verification form utility functions unit tests', () => {
        describe('sortChecksByPriority: Sort Checks by Priority', () => {
            it('should sort check list by priority', () => {
                const expectedSortedCheckListIds = ["ddd", "bbb", "ccc", "aaa"]
                const checkList = [
                    new Check("aaa", 10, "Face on the picture matches face on the document"),
                    new Check("bbb", 5, "Veriff supports presented document"),
                    new Check("ccc", 7, "Face is clearly visible"),
                    new Check("ddd", 3, "Document data is clearly visible")
                ]
                const sortedCheckList = sortChecksByPriority(checkList)
                const sortedCheckListIds = sortedCheckList.map(check => check.id)

                expect(sortedCheckListIds).toEqual(expectedSortedCheckListIds)
            })

            it('should return empty array if no checks are provided', () => {
                const expectedSortedCheckListIds: string[] = []
                const sortedCheckList = sortChecksByPriority([])
                const sortedCheckListIds = sortedCheckList.map(check => check.id)

                expect(sortedCheckListIds).toEqual(expectedSortedCheckListIds)
            })
        })

        describe('getCheckIndexById: Get Check Index by Id', () => {
            it('should return index of the check with the given id', () => {
                const checkId = "bbb"
                const expectedCheckIndex = 1
                const checkList = [
                    new Check("aaa", 10, "Face on the picture matches face on the document"),
                    new Check("bbb", 5, "Veriff supports presented document"),
                    new Check("ccc", 7, "Face is clearly visible"),
                    new Check("ddd", 3, "Document data is clearly visible")
                ]
                const checkIndex = getCheckIndexById(checkList, checkId)

                expect(checkIndex).toEqual(expectedCheckIndex)
            })

            it('should return -1 if check with the given id is not found', () => {
                const checkId = "zzz"
                const expectedCheckIndex = -1
                const checkList = [
                    new Check("aaa", 10, "Face on the picture matches face on the document"),
                    new Check("bbb", 5, "Veriff supports presented document"),
                    new Check("ccc", 7, "Face is clearly visible"),
                    new Check("ddd", 3, "Document data is clearly visible")
                ]
                const checkIndex = getCheckIndexById(checkList, checkId)

                expect(checkIndex).toEqual(expectedCheckIndex)
            })

            it('should return -1 if check list is empty', () => {
                const checkId = "bbb"
                const expectedCheckIndex = -1
                const checkIndex = getCheckIndexById([], checkId)

                expect(checkIndex).toEqual(expectedCheckIndex)
            })
        })

        describe('areAllAnswersYes: Are All Answers Yes', () => {
            it('areAllAnswersYes should be true if all answers are yes', () => {
                const checks = [
                    new Check("ddd", 3, "Document data is clearly visible", false, true),
                    new Check("bbb", 5, "Veriff supports presented document", false, true),
                    new Check("ccc", 7, "Face is clearly visible", false, true),
                    new Check("aaa", 10, "Face on the picture matches face on the document", false, true)
                ]
                const expected = true
                const areAllYes = areAllAnswersYes(checks)

                expect(areAllYes).toEqual(expected)
            })

            it('areAllAnswersYes should be false if at least one answer is no', () => {
                const checks = [
                    new Check("ddd", 3, "Document data is clearly visible", false, true),
                    new Check("bbb", 5, "Veriff supports presented document", false, true),
                    new Check("ccc", 7, "Face is clearly visible", false, false)
                ]
                const expected = false
                const areAllYes = areAllAnswersYes(checks)

                expect(areAllYes).toEqual(expected)
            })

            it('areAllAnswersYes should be false if at least one answer is unanswered', () => {
                const checks = [
                    new Check("ddd", 3, "Document data is clearly visible", false, true),
                    new Check("bbb", 5, "Veriff supports presented document", false, true),
                    new Check("ccc", 7, "Face is clearly visible", false)
                ]
                const expected = false
                const areAllYes = areAllAnswersYes(checks)

                expect(areAllYes).toEqual(expected)
            })

            it('areAllAnswersYes should be false if checks list is empty', () => {
                const checks: any[] = []
                const expected = false
                const areAllYes = areAllAnswersYes(checks)

                expect(areAllYes).toEqual(expected)
            })
        })

        describe('haveAtLeastOneNoAnswer: Have At Least One No Answer', () => {
            it('haveAtLeastOneNoAnswer should be true if at least one answer is no', () => {
                const checks = [
                    new Check("ddd", 3, "Document data is clearly visible", false, true),
                    new Check("bbb", 5, "Veriff supports presented document", false, false)
                ]

                const expected = true
                const haveAtLeastOneNo = haveAtLeastOneNoAnswer(checks)
                expect(haveAtLeastOneNo).toEqual(expected)
            })

            it('haveAtLeastOneNoAnswer should be false if all answers are yes', () => {
                const checks = [
                    new Check("ddd", 3, "Document data is clearly visible", false, true),
                    new Check("bbb", 5, "Veriff supports presented document", false, true)
                ]

                const expected = false
                const haveAtLeastOneNo = haveAtLeastOneNoAnswer(checks)
                expect(haveAtLeastOneNo).toEqual(expected)
            })

            it('haveAtLeastOneNoAnswer should be false if checks list is empty', () => {
                const checks: any[] = []
                const expected = false
                const haveAtLeastOneNo = haveAtLeastOneNoAnswer(checks)
                expect(haveAtLeastOneNo).toEqual(expected)
            })

            it('haveAtLeastOneNoAnswer should be false if all answers are unanswered', () => {
                const checks = [
                    new Check("ddd", 3, "Document data is clearly visible", false),
                    new Check("bbb", 5, "Veriff supports presented document", false)
                ]

                const expected = false
                const haveAtLeastOneNo = haveAtLeastOneNoAnswer(checks)
                expect(haveAtLeastOneNo).toEqual(expected)
            })
        })

        describe('isSubmitButtonDisabled: Check if Submit Button is Disabled', () => {
            it('isSubmitButtonDisabled should be false if at least one answer is no', () => {
                const checks = [
                    new Check("ddd", 3, "Document data is clearly visible", false, true),
                    new Check("bbb", 5, "Veriff supports presented document", false, false)
                ]

                const expected = false
                const isDisabled = isSubmitDisabled(checks)
                expect(isDisabled).toEqual(expected)
            })

            it('isSubmitButtonDisabled should be false if all answers are yes', () => {
                const checks = [
                    new Check("ddd", 3, "Document data is clearly visible", false, true),
                    new Check("bbb", 5, "Veriff supports presented document", false, true)
                ]

                const expected = false
                const isDisabled = isSubmitDisabled(checks)
                expect(isDisabled).toEqual(expected)
            })

            it('isSubmitButtonDisabled should be true if checks list is empty', () => {
                const checks: any[] = []
                const expected = true
                const isDisabled = isSubmitDisabled(checks)
                expect(isDisabled).toEqual(expected)
            })

            it('isSubmitButtonDisabled should be true if all answers are unanswered', () => {
                const checks = [
                    new Check("ddd", 3, "Document data is clearly visible", false),
                    new Check("bbb", 5, "Veriff supports presented document", false)
                ]

                const expected = true
                const isDisabled = isSubmitDisabled(checks)
                expect(isDisabled).toEqual(expected)
            })
        })

        describe('formatRawCheckItems: Format Raw Check Items', () => {
            it('formatRawCheckItems should return formatted check items', () => {
                const rawChecks = [
                    {
                        id: "ddd",
                        priority: 3,
                        description: "Document data is clearly visible",
                        answer: true
                    },
                    {
                        id: "bbb",
                        priority: 5,
                        description: "Veriff supports presented document",
                        answer: false
                    }]

                const expected = [
                    new Check("ddd", 3, "Document data is clearly visible", false, true),
                    new Check("bbb", 5, "Veriff supports presented document", false, false)
                ]

                const formattedChecks = formatRawCheckItems(rawChecks)
                expect(formattedChecks.toString()).toBe(expected.toString())
            })

            it('formatRawCheckItems should return empty array if raw checks is empty', () => {
                const rawChecks: any[] = []
                const expected: any[] = []
                const formattedChecks = formatRawCheckItems(rawChecks)
                expect(formattedChecks).toEqual(expected)
            })
        })

        describe('disableNextChecks: Disable Next Checks', () => {
            it('disableNextChecks should disable next checks', () => {
                const checks = [
                    new Check("ddd", 3, "Document data is clearly visible", false, true),
                    new Check("bbb", 5, "Veriff supports presented document", false, true),
                    new Check("ccc", 7, "Face is clearly visible", false, true)
                ]

                const expected = [
                    new Check("ddd", 3, "Document data is clearly visible", false, true),
                    new Check("bbb", 5, "Veriff supports presented document", false, true),
                    new Check("ccc", 7, "Face is clearly visible", true, true)
                ]

                const disableResult = disableFollowingCheckIndexes(checks, 1)
                expect(disableResult.toString()).toEqual(expected.toString())
            })

            it('disableFollowingCheckIndexes should return empty array if checks is empty', () => {
                const checks: any[] = []
                const expected: any[] = []
                const formattedChecks = disableFollowingCheckIndexes(checks, 0)
                expect(formattedChecks).toEqual(expected)
            })
        })

        describe('enableNextCheck : Enable Next Check', () => {
            it('enableNextCheck should enable next check', () => {
                const checks = [
                    new Check("ddd", 3, "Document data is clearly visible", false, true),
                    new Check("bbb", 5, "Veriff supports presented document", true, true),
                    new Check("ccc", 7, "Face is clearly visible", true, true)
                ]

                const index = 1
                const enableNextResult = enableNextCheck(checks, index)
                expect(enableNextResult[index + 1].disabled).toEqual(false)
            })

            it('enableNextCheck should return empty array if checks is empty', () => {
                const checks: any[] = []
                const expected: any[] = []
                const enableNextResult = enableNextCheck(checks, 0)
                expect(enableNextResult).toEqual(expected)
            })
        })
    })

    describe('Form rendering and actions tests', () => {
        it('renders verification form', () => {
            render(<VerificationForm />)
            const formElement = screen.getByRole('button')
            expect(formElement.getAttribute('type')).toBe('submit')
        })

        it('renders verification form with disabled submit button', () => {
            render(<VerificationForm />)
            const formElement = screen.getByRole('button')
            expect(formElement.getAttribute('disabled')).toBe('')
        })
    })
})
