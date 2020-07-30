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
</script>

<title>ranked.vote: {report.info.jurisdictionName} / {report.info.name} / {report.info.date.substr(0, 4)}</title>

<div class="wide container">
<Report {report} />
</div>