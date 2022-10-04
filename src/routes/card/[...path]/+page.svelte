<script>
  export let data;
  import { base } from '$app/paths';
  const report = data.report;
  import Report from "../../../components/Report.svelte";
  import VoteCounts from "../../../components/report_components/VoteCounts.svelte";

  import { onMount, setContext } from "svelte";

  function getCandidate(cid) {
    if (cid == "X") {
      return { name: "Exhausted", writeIn: false };
    } else {
      return report.candidates[cid];
    }
  }

  setContext("candidates", {
    getCandidate,
  });
</script>

<svelte:head>
    <link rel="stylesheet" href="{base}/card.css" />
</svelte:head>

<div class="card">
    <div class="electionHeader">
      <h3>
        <a href="{base}/">approval.vote</a>
        //
        <strong>{report.info.jurisdictionName}</strong>
        {report.info.officeName}
      </h3>
    </div>



    <div class="segment">
        <VoteCounts candidateVotes={report.totalVotes} />
    </div>
</div>