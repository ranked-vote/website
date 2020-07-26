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
</script>

<div class="row">
  <div class="leftCol">t2</div>
  <div class="rightCol">t1</div>
</div>
