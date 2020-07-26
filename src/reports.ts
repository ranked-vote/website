import { readFileSync } from "fs"
import type { IReportIndex } from "./report_types"

const { RANKED_VOTE_REPORTS } = process.env

export function getIndex(): IReportIndex {
    let indexRaw = readFileSync(RANKED_VOTE_REPORTS + '/index.json')
    let indexParsed = JSON.parse(indexRaw.toString()) as IReportIndex

    return indexParsed
}
