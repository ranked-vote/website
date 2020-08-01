<script type="ts">
  import type { IContestReport, Allocatee, ICandidate } from "../report_types";
  import VoteCounts from "./report_components/VoteCounts.svelte";
  import Sankey from "./report_components/Sankey.svelte";
  import CandidatePairTable from "./report_components/CandidatePairTable.svelte";

  import { onMount, setContext } from "svelte";

  export let report: IContestReport;

  function getCandidate(cid: Allocatee): ICandidate {
    if (cid == "X") {
      return { name: "Exhausted", writeIn: false };
    } else {
      return report.candidates[cid];
    }
  }

  setContext("candidates", {
    getCandidate,
  });

  function formatDate(dateStr: string): string {
    let date = new Date(dateStr);
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "Decemner",
    ];

    return `${
      months[date.getUTCMonth()]
    } ${date.getUTCDate()}, ${date.getUTCFullYear()}`;
  }
</script>

<div class="row">
  <p class="description" />
  <div class="electionHeader">
    <h3>
      <a href="/">ranked.vote</a>
      //
      <strong>{report.info.jurisdictionName}</strong>
      {report.info.officeName}
    </h3>
  </div>
</div>

<div class="row">
  <div class="leftCol">
    <p>
      The {report.info.jurisdictionName} {report.info.electionName} was held on
      <strong>{formatDate(report.info.date)}</strong>.
      <strong>{report.candidates[report.winner].name}</strong>
      was the winner out of <strong>{report.numCandidates}</strong>&nbsp;candidates
      {#if report.rounds.length > 1}
        {' '}after <strong>{report.rounds.length - 1}</strong>&nbsp;elimination rounds.
      {:else}
        . No elimination rounds were necessary to determine the outcome.
      {/if}
    </p>
  </div>
  <div class="rightCol">
    <VoteCounts candidateVotes={report.totalVotes} />
  </div>
</div>

{#if report.rounds.length > 1}
  <div class="row">
    <div class="leftCol">
      <h2>Runoff Rounds</h2>

      <p>
        This diagram shows the votes of each remaining candidate at each round,
        as well as the breakdown of votes transferred when each candidate was
        eliminated.
      </p>
    </div>

    <div class="rightCol">
      <Sankey rounds={report.rounds} />
    </div>
  </div>
{/if}

<div class="row">
  <div class="leftCol">
    <h2>Pairwise Preferences</h2>
    <p>
      For every pair of candidates, this table shows the fraction of voters
      who preferred one to the other. A preference means that either a voter ranks a
      candidate ahead of the other, or ranks one candidate but does not list the
      other. Ballots which list neither candidate are not counted towards the
      percent counts.
    </p>
  </div>

  <div class="rightCol">
    <CandidatePairTable data={report.pairwisePreferences} rowLabel="Preferred Candidate" colLabel="Less-preferred Candidate" />
  </div>
</div>

<div class="row">
  <div class="leftCol">
    <h2>First Alternate</h2>
    <p>
      For every pair of candidates, this table shows the fraction of voters who
      ranked one candidate first ranked the other candidate second.
    </p>
  </div>

  <div class="rightCol">
    <CandidatePairTable data={report.firstAlternate} rowLabel="First Choice" colLabel="Second Choice" />
  </div>
</div>

{#if report.rounds.length > 1}
  <div class="row">
    <div class="leftCol">
      <h2>Final Vote by First Choice</h2>
      <p>This table tracks which candidate ballots were ultimately allocated to, for ballots that ranked an eliminated candidate first.</p>
    </div>

    <div class="rightCol">
      <CandidatePairTable data={report.firstFinal} rowLabel="First Round Choice" colLabel="Final Round Choice" />
    </div>
  </div>
{/if}
