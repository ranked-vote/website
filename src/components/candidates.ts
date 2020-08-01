import type { ICandidateVotes, Allocatee, ICandidate } from "../report_types";

export interface CandidateContext {
    getCandidate: (c: Allocatee) => ICandidate
}

