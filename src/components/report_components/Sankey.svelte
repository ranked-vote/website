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
  const edgeMargin = 40;

  const candidateMargin = 20; // px
  const firstRoundAllocations = rounds[0].allocations;
  const firstRoundNumCandidates = firstRoundAllocations.length - 1;
  const voteScale =
    (width - candidateMargin * firstRoundNumCandidates - 2 * edgeMargin) /
    firstRoundAllocations.reduce((a, b) => a + b.votes, 0);

  const innerHeight = roundHeight * (rounds.length - 1) + voteBlockHeight;
  const labelSpace = 100;
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
      let width = Math.max(1, this.width);
      let {r1y, r2y, r1x, r2x} = this;
      r1x = r1x - Math.min(width - this.width, 0);
      let r1x2 = r1x + width;
      let r2x2 = r2x + width;
      return `
            M ${r1x} ${r1y}
            H ${r1x2}
            C ${r1x2} ${midY} ${r2x2} ${midY} ${r2x2} ${r2y}
            H ${r2x}
            C ${r2x} ${midY} ${r1x} ${midY} ${r1x} ${r1y}
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
  <g transform={`translate(${edgeMargin} ${labelSpace})`}>
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
          width={Math.max(1, voteBlock.width)}
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
