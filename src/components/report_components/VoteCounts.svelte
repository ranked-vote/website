<script type="ts">
  import type {
    ICandidateVotes,
    CandidateId,
    ICandidate,
  } from "../../report_types";
  import type { CandidateContext } from "../candidates";
  import { getContext } from "svelte";

  export let candidateVotes: ICandidateVotes[];

  const { getCandidate } = getContext("candidates") as CandidateContext;

  const outerHeight = 24;
  const innerHeight = 14;
  const labelSpace = 130;
  const width = 600;

  const maxVotes = Math.max(...candidateVotes.map((d) => d.firstRoundVotes + d.transferVotes));
  const scale = (width - labelSpace - 5) / maxVotes;

  const height = outerHeight * candidateVotes.length;
</script>

<style>
  .firstRound {
    fill: #aa0d0d;
  }

  .transfer {
    fill: #e7ada0;
  }

  .eliminated {
    opacity: 30%;
  }
</style>

<svg width="100%" viewBox={`0 0 ${width} ${height}`}>
  <g transform={`translate(${labelSpace} 0)`}>
    {#each candidateVotes as votes, i}
      <g
        class={votes.roundEliminated === null ? '' : 'eliminated'}
        transform={`translate(0 ${outerHeight * (i + 0.5)})`}>
        <text font-size="12" text-anchor="end" dominant-baseline="middle">
          {getCandidate(votes.candidate).name}
        </text>
        <g transform={`translate(5 ${-innerHeight / 2 - 1})`}>
          <rect
            class="firstRound"
            height={innerHeight}
            width={scale * votes.firstRoundVotes} />
          <rect
            class="transfer"
            x={scale * votes.firstRoundVotes}
            height={innerHeight}
            width={scale * votes.transferVotes} />
        </g>
        {#if votes.roundEliminated !== null}
            <text
            font-size="12"
            dominant-baseline="middle"
            x={10 + scale * (votes.firstRoundVotes + votes.transferVotes)}>
            Eliminated in round {votes.roundEliminated}
            </text>
        {/if}
      </g>
    {/each}
  </g>
</svg>
