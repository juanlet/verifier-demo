import { areAllAnswersYes, formatRawCheckItems, getCheckIndexById, isSubmitDisabled, sortChecksByPriority } from "@/components/VerificationForm"
import { describe, expect, it } from "vitest"

describe('verification form', () => {
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

    describe('isSubmitButtonDisabled: Check if Submit Button is Disabled', () => {
        it('should return true if there is at least one check with answer set to exctrictly false value(no), this would be the last enabled value of the list', () => {
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
            const formattedCheckList = formatRawCheckItems(sortedCheckList)
            const expectedIsSubmitButtonDisabled = true
            const isSubmitButtonDisabled = isSubmitDisabled(formattedCheckList)
            expect(isSubmitButtonDisabled).toEqual(expectedIsSubmitButtonDisabled)
        })
    })
})
