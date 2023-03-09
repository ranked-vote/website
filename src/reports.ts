import { readFileSync } from "fs";
import type { IReportIndex, IContestReport } from "./report_types";

export function getIndex(): IReportIndex {
  let indexRaw = readFileSync(`$lib/reports/index.json`);
  let indexParsed = JSON.parse(indexRaw.toString()) as IReportIndex;

  return indexParsed;
}

export function getReport(path: string): IContestReport {
  let reportRaw = readFileSync(`$lib/reports/${path}/report.json`);
  let reportParsed = JSON.parse(reportRaw.toString()) as IContestReport;

  return reportParsed;
}
