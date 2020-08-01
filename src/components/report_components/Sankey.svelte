<script type="ts">
  import type {
    ITabulatorRound,
    Allocatee,
    CandidateId,
  } from "../../report_types";
  import type { CandidateContext } from "../candidates";
  import { getContext } from "svelte";

  export let rounds: ITabulatorRound[];

  const { getCandidate } = getContext("candidates") as CandidateContext;

  const outerHeight = 24;
  const width = 600;
  const roundHeight = 90;
  const voteBlockHeight = 14;

  const candidateMargin = 20; // px
  const firstRoundAllocations = rounds[0].allocations;
  const firstRoundNumCandidates = firstRoundAllocations.length - 1;
  const voteScale =
    (width - candidateMargin * firstRoundNumCandidates - 20) /
    firstRoundAllocations.reduce((a, b) => a + b.votes, 0);

  const innerHeight = roundHeight * (rounds.length - 1) + voteBlockHeight;
  const labelSpace = 150;
  const height = 2 * labelSpace + innerHeight;

  interface VoteBlock {
    x: number;
    width: number;
    y: number;
    allocatee: Allocatee;
  }

  class TransferBlock {
    constructor(
      private r1x: number,
      private r2x: number,
      private width: number,
      private r1y: number,
      private r2y: number
    ) {}

    toPath(): string {
      let midY = (this.r1y + this.r2y) / 2;
      return `
            M ${this.r1x} ${this.r1y}
            H ${this.r1x + this.width}
            C ${this.r1x + this.width} ${midY} ${
        this.r2x + this.width
      } ${midY} ${this.r2x + this.width} ${this.r2y}
            H ${this.r2x}
            C ${this.r2x} ${midY} ${this.r1x} ${midY} ${this.r1x} ${this.r1y}
            Z
        `;
    }
  }

  let transfers: TransferBlock[] = [];

  interface CandidateState {
    xOffset: number;
    width: number;
    accountedIn: number;
    accountedOut: number;
  }

  let lastVotes: Map<Allocatee, CandidateState> = new Map();

  let voteBlockRows: VoteBlock[][] = rounds.map((round, i) => {
    let voteBlocks: VoteBlock[] = [];
    let curVotes: Map<Allocatee, CandidateState> = new Map();
    let numCandidates = round.allocations.length - 1;
    let offset =
      (firstRoundNumCandidates - numCandidates) * (candidateMargin / 2);
    for (let allocation of round.allocations) {
      let width = voteScale * allocation.votes;
      voteBlocks.push({
        x: offset,
        width,
        y: i * roundHeight,
        allocatee: allocation.allocatee
      });

      let last = lastVotes.get(allocation.allocatee);
      let accountedIn = 0;
      if (last) {
        transfers.push(
          new TransferBlock(
            last.xOffset,
            (allocation.allocatee === 'X') ? offset + width - last.width : offset,
            last.width,
            (i - 1) * roundHeight + voteBlockHeight,
            i * roundHeight
          )
        );

        if (allocation.allocatee !== 'X') {
            accountedIn = last.width;
        }
      }

      curVotes.set(allocation.allocatee, {
        xOffset: offset,
        width,
        accountedIn,
        accountedOut: 0,
      });

      offset += width + candidateMargin;
    }

    // Compute transfers.

    for (let transfer of round.transfers) {
      let last = lastVotes.get(transfer.from);
      let cur = curVotes.get(transfer.to);

      let width = transfer.count * voteScale;

      transfers.push(
        new TransferBlock(
          last.xOffset + last.accountedOut,
          cur.xOffset + cur.accountedIn,
          width,
          (i - 1) * roundHeight + voteBlockHeight,
          i * roundHeight
        )
      );

      last.accountedOut += width;
      cur.accountedIn += width;
    }

    lastVotes = curVotes;
    return voteBlocks;
  });
</script>

<style>
  .voteBlock {
    fill: #aa0d0d;
  }

  .voteBlock.exhausted {
    fill: #ccc;
  }

  .transfer {
    fill: #444;
    opacity: 0.2;
    mix-blend-mode: exclusion;
  }
</style>

<svg width="100%" viewBox={`0 0 ${width} ${height}`}>
  <g transform={`translate(10 ${labelSpace})`}>
    {#each voteBlockRows[0] as voteBlock}
      <g transform={`translate(${voteBlock.x + voteBlock.width / 2} -10)`}>
        <text font-size="12" dominant-baseline="middle" transform="rotate(-90)">{getCandidate(voteBlock.allocatee).name}</text>
    </g>
    {/each}

    {#each voteBlockRows as voteBlockRow}
      {#each voteBlockRow as voteBlock}
        <rect
          class={voteBlock.allocatee == 'X' ? 'voteBlock exhausted' : 'voteBlock'}
          y={voteBlock.y}
          x={voteBlock.x}
          width={voteBlock.width}
          height={voteBlockHeight} />
      {/each}
    {/each}

    {#each transfers as transfer}
      <path class="transfer" d={transfer.toPath()} />
    {/each}

    {#each voteBlockRows[voteBlockRows.length - 1] as voteBlock}
      <g transform={`translate(${voteBlock.x + voteBlock.width / 2} ${innerHeight + 10})`}>
        <text font-size="12" dominant-baseline="middle" text-anchor="end" transform="rotate(-90)">{getCandidate(voteBlock.allocatee).name}</text>
    </g>
    {/each}
  </g>
</svg>
