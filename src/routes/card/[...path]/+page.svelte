<script lang='ts'>
  import { base } from '$app/paths';
  export let data;
  let report: IContestReport = data.report;
  import VoteCounts from '../../../components/report_components/VoteCounts.svelte';
  import type { IContestReport } from '../../../report_types';

  import { onMount, setContext } from 'svelte';

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
    <VoteCounts report={report} />
  </div>
</div>
