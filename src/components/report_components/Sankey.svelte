<script type="ts">
  import type {
    ITabulatorRound,
    Allocatee,
    CandidateId,
  } from "../../report_types";
  import type { CandidateContext } from "../candidates";
  import { EXHAUSTED } from "../candidates";
  import { getContext } from "svelte";
  import tooltip from "../../tooltip";

  export let rounds: ITabulatorRound[];

  const { getCandidate } = getContext("candidates") as CandidateContext;

  const outerHeight = 24;
  const width = 600;
  const roundHeight = 90;
  const voteBlockHeight = 14;
  const edgeMargin = 60;

  const candidateMargin = 20; // px
  const firstRoundAllocations = rounds[0].allocations;
  const firstRoundNumCandidates = firstRoundAllocations.length - 1;
  const voteScale =
    (width - candidateMargin * firstRoundNumCandidates - edgeMargin - 10) /
    firstRoundAllocations.reduce((a, b) => a + b.votes, 0);

  const innerHeight = roundHeight * (rounds.length - 1) + voteBlockHeight;
  const labelSpace = 100;
  const height = 2 * labelSpace + innerHeight;

  class VoteBlock {
    constructor(
      public x: number,
      public width: number,
      public y: number,
      private allocatee: Allocatee,
      private votes: number,
      private round: number
    ) {}

    isExhausted(): boolean {
      return this.allocatee === EXHAUSTED;
    }

    label(): string {
      return getCandidate(this.allocatee).name;
    }

    tooltip(): string {
      if (this.isExhausted()) {
        return `
        <strong>${this.votes.toLocaleString()}</strong> votes
        were exhausted
        in round <strong>${this.round}</strong>`;
      } else {
        return `
        <strong>${getCandidate(this.allocatee).name}</strong> received
        <strong>${this.votes.toLocaleString()}</strong> votes
        in round <strong>${this.round}</strong>`;
      }
    }
  }

  class TransferBlock {
    constructor(
      private fromCandidate: Allocatee,
      private toCandidate: Allocatee,
      private votes: number,
      private round: number,
      private r1x: number,
      private r2x: number,
      private width: number,
      private r1y: number,
      private r2y: number
    ) {}

    toPath(): string {
      let midY = (this.r1y + this.r2y) / 2;
      let width = Math.max(1, this.width);
      let { r1y, r2y, r1x, r2x } = this;
      r1x = r1x - Math.min(width - this.width, 0);
      let r1x2 = r1x + width;
      let r2x2 = r2x + width;
      return `\
            M ${r1x} ${r1y} \
            H ${r1x2} \
            C ${r1x2} ${midY} ${r2x2} ${midY} ${r2x2} ${r2y} \
            H ${r2x} \
            C ${r2x} ${midY} ${r1x} ${midY} ${r1x} ${r1y} \
            Z \
        `;
    }

    tooltip(): string {
      if (this.fromCandidate === EXHAUSTED) {
        return `<strong>${this.votes.toLocaleString()}</strong> exhausted votes
        carried over into round <strong>${this.round}</strong>`;
      } else if (this.toCandidate === EXHAUSTED) {
        return `<strong>${this.votes.toLocaleString()}</strong> votes
        for <strong>${getCandidate(this.fromCandidate).name}</strong>
        became exhausted in round <strong>${this.round}</strong>`;
      } else if (this.fromCandidate === this.toCandidate) {
        return `<strong>${this.votes.toLocaleString()}</strong> votes
        for <strong>${getCandidate(this.toCandidate).name}</strong>
        carried over into round <strong>${this.round}</strong>`;
      } else {
        return `<strong>${this.votes.toLocaleString()}</strong> votes
        for <strong>${getCandidate(this.fromCandidate).name}</strong>
        were transferred to <strong>${
          getCandidate(this.toCandidate).name
        }</strong>
        in round <strong>${this.round}</strong>`;
      }
    }
  }

  let transfers: TransferBlock[] = [];

  interface CandidateState {
    xOffset: number;
    width: number;
    votes: number;
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
      voteBlocks.push(
        new VoteBlock(
          offset,
          width,
          i * roundHeight,
          allocation.allocatee,
          allocation.votes,
          i + 1
        )
      );

      let last = lastVotes.get(allocation.allocatee);
      let accountedIn = 0;
      if (last) {
        transfers.push(
          new TransferBlock(
            allocation.allocatee,
            allocation.allocatee,
            last.votes,
            i + 1,
            last.xOffset,
            allocation.allocatee === "X" ? offset + width - last.width : offset,
            last.width,
            (i - 1) * roundHeight + voteBlockHeight,
            i * roundHeight
          )
        );

        if (allocation.allocatee !== "X") {
          accountedIn = last.width;
        }
      }

      curVotes.set(allocation.allocatee, {
        xOffset: offset,
        votes: allocation.votes,
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
          transfer.from,
          transfer.to,
          transfer.count,
          i + 1,
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
  {#each rounds as _, i}
    <text dominant-baseline="middle" font-size="10" y={i * roundHeight + labelSpace + voteBlockHeight / 2}>Round {i+1}</text>
  {/each}
  <g transform={`translate(${edgeMargin} ${labelSpace})`}>
    {#each voteBlockRows[0] as voteBlock}
      <g transform={`translate(${voteBlock.x + voteBlock.width / 2} -10)`}>
        <text font-size="12" dominant-baseline="middle" transform="rotate(-90)">
          {voteBlock.label()}
        </text>
      </g>
    {/each}

    {#each voteBlockRows as voteBlockRow}
      {#each voteBlockRow as voteBlock}
        <rect
          use:tooltip={voteBlock.tooltip()}
          class={voteBlock.isExhausted() ? 'voteBlock exhausted' : 'voteBlock'}
          y={voteBlock.y}
          x={voteBlock.x}
          width={Math.max(1, voteBlock.width)}
          height={voteBlockHeight} />
      {/each}
    {/each}

    {#each transfers as transfer}
      <path
        use:tooltip={transfer.tooltip()}
        class="transfer"
        d={transfer.toPath()} />
    {/each}

    {#each voteBlockRows[voteBlockRows.length - 1] as voteBlock}
      <g
        transform={`translate(${voteBlock.x + voteBlock.width / 2} ${innerHeight + 10})`}>
        <text
          font-size="12"
          dominant-baseline="middle"
          text-anchor="end"
          transform="rotate(-90)">
          {voteBlock.label()}
        </text>
      </g>
    {/each}
  </g>
</svg>
