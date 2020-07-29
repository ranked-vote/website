<script type="ts">
  import type { IContestReport, IAllocatee, ICandidate } from "../report_types";
  import VoteCounts from "./report_components/VoteCounts.svelte";
  import { onMount, setContext } from "svelte";

  export let report: IContestReport;

  function getCandidate(cid: IAllocatee): ICandidate {
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
    </p>
    <p>
      <strong>{report.candidates[report.winner].name}</strong>
      was the winner out of
      <strong>{report.numCandidates}</strong>
      candidates after
      <strong>{report.rounds.length}</strong>
      elimination rounds.
    </p>
  </div>
  <div class="rightCol">
    <VoteCounts candidateVotes={report.totalVotes} />
  </div>
</div>
