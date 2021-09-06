<script context="module">
  export async function preload(page, session) {
    let {path} = page.params;
    let result = await this.fetch(`/api/${path.join('/')}/report.json`);
    let report = await result.json();
    return {report};
  }
</script>

<script>
  // TODO: this could be a TS script once this Sapper issue is closed:
  // https://github.com/sveltejs/sapper/pull/1222
  export let report;
  import Report from "../../components/Report.svelte";
  import Sankey from "../../components/report_components/Sankey.svelte";
  import VoteCounts from "../../components/report_components/VoteCounts.svelte";

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
    <link rel="stylesheet" href="/card.css" />
</svelte:head>

<div class="card">
    <div class="electionHeader">
      <h3>
        <a href="/">ranked.vote</a>
        //
        <strong>{report.info.jurisdictionName}</strong>
        {report.info.officeName}
      </h3>
    </div>

    <div class="segment">
      <Sankey rounds={report.rounds} />
    </div>

    <div class="segment">
        <VoteCounts candidateVotes={report.totalVotes} />
    </div>
</div>