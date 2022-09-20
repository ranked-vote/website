<script type="ts">
  import type {
    IContestReport,
    Allocatee,
    ICandidate,
    ICandidatePairEntry,
  } from "../report_types";
  import VoteCounts from "./report_components/VoteCounts.svelte";
  import Sankey from "./report_components/Sankey.svelte";
  import CandidatePairTable from "./report_components/CandidatePairTable.svelte";
  import { EXHAUSTED } from "./candidates";

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
      <a href="/">approval.vote</a>
      //
      <strong>{report.info.jurisdictionName}</strong>
      {report.info.officeName}
    </h3>
  </div>
</div>

<div class="row">
  <div class="leftCol">
    <p>
      The
      {#if report.info.website}
      <a href={report.info.website}>{report.info.jurisdictionName} {report.info.electionName}</a>
      {:else}
      {report.info.jurisdictionName} {report.info.electionName}
      {/if}
      was held on
      <strong>{formatDate(report.info.date)}</strong>.
      <strong>{getCandidate(report.winner).name}</strong> 
      <!-- TODO: Allow for multiple winners -->
      was the winner out of
      <strong>{report.numCandidates}</strong>&nbsp;{#if report.numCandidates == 1}candidate {:else}candidates{/if}.
    </p>
    <p>
      {#if report.winner == report.condorcet}
        <strong>{getCandidate(report.winner).name}</strong> was also the <a href="https://en.wikipedia.org/wiki/Condorcet_method">Condorcet winner</a>.
      {:else}
        <strong>{getCandidate(report.condorcet).name}</strong> was the <a href="https://en.wikipedia.org/wiki/Condorcet_method">Condorcet winner</a>.
      {/if}
    </p>
  </div>
  <div class="rightCol">
    <VoteCounts candidateVotes={report.totalVotes} />
  </div>
</div>

{#if report.numCandidates > 1}
<div class="row">
  <div class="leftCol">
    <h2>Pairwise Preferences</h2>
    <p>
      For every pair of candidates, this table shows the fraction of voters who
      preferred one to the other. A preference means that either a voter ranks a
      candidate ahead of the other, or ranks one candidate but does not list the
      other. Ballots which rank neither candidate are not counted towards the
      percent counts.
    </p>
  </div>

  <div class="rightCol">
    <CandidatePairTable
      data={report.pairwisePreferences}
      rowLabel="Preferred Candidate"
      colLabel="Less-preferred Candidate"
      generateTooltip={(row, col, entry) => `
        Of the <strong>${entry.denominator.toLocaleString()}</strong> voters
        who expressed a preference, <strong>${Math.round(entry.frac * 1000) / 10}%</strong>
        (<strong>${entry.numerator.toLocaleString()}</strong>) preferred
        <strong>${getCandidate(row).name}</strong> to <strong>${getCandidate(col).name}</strong>.
      `} />
  </div>
</div>

<!-- <div class="row">
  <div class="leftCol">
    <h2>First Alternate</h2>
    <p>
      For every pair of candidates, this table shows the fraction of voters who
      approval one candidate first approval the other candidate second.
    </p>
  </div>

  <div class="rightCol">
    <CandidatePairTable
      generateTooltip={(row, col, entry) => (col !== EXHAUSTED ? `
        Of the <strong>${entry.denominator.toLocaleString()}</strong> voters who chose <strong>${getCandidate(row).name}</strong>
        as their first choice, <strong>${entry.numerator.toLocaleString()}</strong>
        (<strong>${Math.round(entry.frac * 1000) / 10}%</strong>)
        chose <strong>${getCandidate(col).name}</strong>
        as their second choice.
        ` : `
        Of the <strong>${entry.denominator.toLocaleString()}</strong> voters who chose <strong>${getCandidate(row).name}</strong>
        as their first choice, <strong>${entry.numerator.toLocaleString()}</strong>
        (<strong>${Math.round(entry.frac * 1000) / 10}%</strong>)
        did not rank another candidate.
       `)}
      data={report.firstAlternate}
      rowLabel="First Choice"
      colLabel="Second Choice" />
  </div>
</div>
{/if}

{#if report.rounds.length > 1}
  <div class="row">
    <div class="leftCol">
      <h2>Final Vote by First Choice</h2>
      <p>
        This table tracks which candidate ballots were ultimately allocated to,
        among ballots that approval an eliminated candidate first.
      </p>
    </div>

    <div class="rightCol">
      <CandidatePairTable
        generateTooltip={(row, col, entry) => (col !== EXHAUSTED ? `
        Of the <strong>${entry.denominator.toLocaleString()}</strong> ballots that approval <strong>${getCandidate(row).name}</strong>
        first, <strong>${entry.numerator.toLocaleString()}</strong>
        (<strong>${Math.round(entry.frac * 1000) / 10}%</strong>)
        were allocated to <strong>${getCandidate(col).name}</strong>
        in the final round.
        ` : `
        Of the <strong>${entry.denominator.toLocaleString()}</strong> ballots that approval <strong>${getCandidate(row).name}</strong>
        first, <strong>${entry.numerator.toLocaleString()}</strong>
        (<strong>${Math.round(entry.frac * 1000) / 10}%</strong>)
        were exhausted by the final round.
        `)}
        data={report.firstFinal}
        rowLabel="First Round Choice"
        colLabel="Final Round Choice" />
    </div>
  </div>
-->
{/if}
