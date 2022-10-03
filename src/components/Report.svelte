<script type="ts">
  import type {
    IContestReport,
    Allocatee,
    ICandidate,
    ICandidatePairEntry,
  } from '../report_types';
  import VoteCounts from './report_components/VoteCounts.svelte';
  import Sankey from './report_components/Sankey.svelte';
  import CandidatePairTable from './report_components/CandidatePairTable.svelte';
  import { EXHAUSTED } from './candidates';

  import { onMount, setContext } from 'svelte';

  export let report: IContestReport;

  function getCandidate(cid: Allocatee): ICandidate {
    if (cid == 'X') {
      return { name: 'Exhausted', writeIn: false };
    } else {
      return report.candidates[cid];
    }
  }

  function getWinners(cids: Allocatee[]): ICandidate[] {
    if (cids[0] == 'X') {
      return [{ name: 'Exhausted', writeIn: false }];
    }
    if (cids.length == 1) {
      return [report.candidates[0]];
    }

    return cids.map(
      (cid): ICandidate => {
        return report.candidates[cid];
      }
    );
  }

  setContext('candidates', {
    getCandidate,
  });

  function formatDate(dateStr: string): string {
    let date = new Date(dateStr);
    const months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'Decemner',
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
        <a href={report.info.website}>
          {report.info.jurisdictionName} {report.info.electionName}
        </a>
      {:else}{report.info.jurisdictionName} {report.info.electionName}{/if}
      was held on
      <strong>{formatDate(report.info.date)}</strong>.
      {#each getWinners(report.winners) as winner, i}
        {#if i == 0}
          <strong>{winner.name}</strong>
        {:else if i == report.winners.length - 1}
          , and
          <strong>{winner.name}</strong>
        {:else}
          ,
          <strong>{winner.name}</strong>
        {/if}
      {/each}

      <!-- TODO: Allow for multiple winners -->
      {#if report.winners.length == 1}
        was the winner out of
      {:else}were the winners out of{/if}
      <strong>{report.numCandidates}</strong>
      {#if report.numCandidates == 1}candidate{:else}candidates{/if}.
    </p>
    <!-- <p>
      {#if report.winner == report.condorcet}
        <strong>{getCandidate(report.winner).name}</strong> was also the <a href="https://en.wikipedia.org/wiki/Condorcet_method">Condorcet winner</a>.
      {:else}
        <strong>{getCandidate(report.condorcet).name}</strong> was the <a href="https://en.wikipedia.org/wiki/Condorcet_method">Condorcet winner</a>.
      {/if}
    </p> -->
  </div>
  <div class="rightCol">
    <VoteCounts candidateVotes={report.totalVotes} />
  </div>
</div>

{#if report.numCandidates > 1 && report.pairwisePreferences}
  <div class="row">
    <div class="leftCol">
      <h2>Pairwise Approval</h2>
      <p>
        For every pair of candidates, this table shows the correlation of votes between candidates.
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
      `}
      />
    </div>
  </div>
{/if}