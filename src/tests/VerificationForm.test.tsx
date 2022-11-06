import VerificationForm, { areAllAnswersYes, disableFollowingCheckIndexes, enableNextCheck, formatRawCheckItems, getCheckIndexById, haveAtLeastOneNoAnswer, isSubmitDisabled, sortChecksByPriority } from "@/components/VerificationForm"
import { describe, expect, it, vi } from "vitest"
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'

vi.mock("react-router-dom", () => {
    return { useNavigate: vi.fn() }
})

describe('verification form', () => {
    describe('Verification form utility functions unit tests', () => {
        describe('sortChecksByPriority: Sort Checks by Priority', () => {
            it('should sort check list by priority', () => {
                const expectedSortedCheckListIds = ["ddd", "bbb", "ccc", "aaa"]
                const checkList = [
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
                const checkIndex = getCheckIndexById(checkList, checkId)

                expect(checkIndex).toEqual(expectedCheckIndex)
            })

            it('should return -1 if check with the given id is not found', () => {
                const checkId = "zzz"
                const expectedCheckIndex = -1
                const checkList = [
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
                        answer: true
                    },
                    {
                        id: "ccc",
                        priority: 7,
                        description: "Face is clearly visible",
                        answer: true
                    },
                    {
                        id: "aaa",
                        priority: 10,
                        description: "Face on the picture matches face on the document",
                        answer: true
                    }
                ]
                const expected = true
                const areAllYes = areAllAnswersYes(checks)

                expect(areAllYes).toEqual(expected)
            })

            it('areAllAnswersYes should be false if at least one answer is no', () => {
                const checks = [
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
                    },
                    {
                        id: "ccc",
                        priority: 7,
                        description: "Face is clearly visible",
                        answer: true
                    },
                    {
                        id: "aaa",
                        priority: 10,
                        description: "Face on the picture matches face on the document",
                        answer: true
                    }
                ]
                const expected = false
                const areAllYes = areAllAnswersYes(checks)

                expect(areAllYes).toEqual(expected)
            })

            it('areAllAnswersYes should be false if at least one answer is null', () => {
                const checks = [
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
                        answer: null
                    },
                    {
                        id: "ccc",
                        priority: 7,
                        description: "Face is clearly visible",
                        answer: true
                    },
                    {
                        id: "aaa",
                        priority: 10,
                        description: "Face on the picture matches face on the document",
                        answer: true
                    }
                ]
                const expected = false
                const areAllYes = areAllAnswersYes(checks)

                expect(areAllYes).toEqual(expected)
            })

            it('areAllAnswersYes should be false if at least one answer is undefined', () => {
                const checks = [
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
                        answer: undefined
                    },
                    {
                        id: "ccc",
                        priority: 7,
                        description: "Face is clearly visible",
                        answer: true
                    },
                    {
                        id: "aaa",
                        priority: 10,
                        description: "Face on the picture matches face on the document",
                        answer: true
                    }
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

                const expected = true
                const haveAtLeastOneNo = haveAtLeastOneNoAnswer(checks)
                expect(haveAtLeastOneNo).toEqual(expected)
            })

            it('haveAtLeastOneNoAnswer should be false if all answers are yes', () => {
                const checks = [
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
                        answer: true
                    }]

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

            it('haveAtLeastOneNoAnswer should be false if all answers are null', () => {
                const checks = [
                    {
                        id: "ddd",
                        priority: 3,
                        description: "Document data is clearly visible",
                        answer: null
                    },
                    {
                        id: "bbb",
                        priority: 5,
                        description: "Veriff supports presented document",
                        answer: null
                    }]

                const expected = false
                const haveAtLeastOneNo = haveAtLeastOneNoAnswer(checks)
                expect(haveAtLeastOneNo).toEqual(expected)
            })

            it('haveAtLeastOneNoAnswer should be false if all answers are undefined', () => {
                const checks = [
                    {
                        id: "ddd",
                        priority: 3,
                        description: "Document data is clearly visible",
                        answer: undefined
                    },
                    {
                        id: "bbb",
                        priority: 5,
                        description: "Veriff supports presented document",
                        answer: undefined
                    }]

                const expected = false
                const haveAtLeastOneNo = haveAtLeastOneNoAnswer(checks)
                expect(haveAtLeastOneNo).toEqual(expected)
            })
        })

        describe('isSubmitButtonDisabled: Check if Submit Button is Disabled', () => {
            it('isSubmitButtonDisabled should be false if at least one answer is no', () => {
                const checks = [
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

                const expected = false
                const isDisabled = isSubmitDisabled(checks)
                expect(isDisabled).toEqual(expected)
            })

            it('isSubmitButtonDisabled should be false if all answers are yes', () => {
                const checks = [
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
                        answer: true
                    }]

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

            it('isSubmitButtonDisabled should be true if all answers are null', () => {
                const checks = [
                    {
                        id: "ddd",
                        priority: 3,
                        description: "Document data is clearly visible",
                        answer: null
                    },
                    {
                        id: "bbb",
                        priority: 5,
                        description: "Veriff supports presented document",
                        answer: null
                    }]

                const expected = true
                const isDisabled = isSubmitDisabled(checks)
                expect(isDisabled).toEqual(expected)
            })

            it('isSubmitButtonDisabled should be true if all answers are undefined', () => {
                const checks = [
                    {
                        id: "ddd",
                        priority: 3,
                        description: "Document data is clearly visible",
                        answer: undefined
                    },
                    {
                        id: "bbb",
                        priority: 5,
                        description: "Veriff supports presented document",
                        answer: undefined
                    }]

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
                    {
                        id: "ddd",
                        priority: 3,
                        description: "Document data is clearly visible",
                        disabled: false,
                        answer: null
                    },
                    {
                        id: "bbb",
                        priority: 5,
                        disabled: true,
                        description: "Veriff supports presented document",
                        answer: null
                    }]

                const formattedChecks = formatRawCheckItems(rawChecks)
                expect(formattedChecks).toEqual(expected)
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
                    {
                        id: "ddd",
                        priority: 3,
                        description: "Document data is clearly visible",
                        answer: true,
                        disabled: false
                    },
                    {
                        id: "bbb",
                        priority: 5,
                        description: "Veriff supports presented document",
                        answer: true,
                        disabled: false
                    },
                    {
                        id: "ccc",
                        priority: 7,
                        description: "Face is clearly visible",
                        answer: true,
                        disabled: false
                    }
                ]

                const expected = [
                    {
                        id: "ddd",
                        priority: 3,
                        description: "Document data is clearly visible",
                        disabled: false,
                        answer: true
                    },
                    {
                        id: "bbb",
                        priority: 5,
                        description: "Veriff supports presented document",
                        disabled: false,
                        answer: true
                    },
                    {
                        id: "ccc",
                        priority: 7,
                        description: "Face is clearly visible",
                        disabled: true,
                        answer: null
                    }
                ]

                const disableResult = disableFollowingCheckIndexes(checks, 1)
                expect(disableResult).toEqual(expected)
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
                    {
                        id: "ddd",
                        priority: 3,
                        description: "Document data is clearly visible",
                        answer: true,
                        disabled: false
                    },
                    {
                        id: "bbb",
                        priority: 5,
                        description: "Veriff supports presented document",
                        answer: true,
                        disabled: true
                    },
                    {
                        id: "ccc",
                        priority: 7,
                        description: "Face is clearly visible",
                        answer: true,
                        disabled: true
                    }
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
