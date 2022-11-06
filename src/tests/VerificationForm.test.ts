import { areAllAnswersYes, formatRawCheckItems, getCheckIndexById, haveAtLeastOneNoAnswer, isSubmitDisabled, sortChecksByPriority } from "@/components/VerificationForm"
import { isResponseError } from "@/services/api"
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
})
