import type { ICandidateVotes, IAllocatee, ICandidate } from "../report_types";

export interface CandidateContext {
    getCandidate: (c: IAllocatee) => ICandidate
}

