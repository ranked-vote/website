import type { Allocatee, ICandidate } from "../report_types";

export interface CandidateContext {
    getCandidate: (c: Allocatee) => ICandidate
}

export const EXHAUSTED: Allocatee = 'X';

