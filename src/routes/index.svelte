<script context="module">
  export async function preload(page, session) {
    let result = await this.fetch("/api/reports.json");
    let index = await result.json();
    return index;
  }
</script>

<script>
  // TODO: this could be a TS script once this Sapper issue is closed:
  // https://github.com/sveltejs/sapper/pull/1222
  import ElectionIndex from "../components/ElectionIndex.svelte";

  export let elections;
</script>

<title>ranked.vote: detailed reports on ranked-choice elections.</title>

<div class="wide container">
<div class="row">
  <div class="leftCol">
    <div class="description">
      <h1>ranked.vote</h1>:
      detailed reports on ranked-choice elections.
    </div>
    <p>
      Ranked-choice elections produce more data on voter preferences than
      traditional pick-one elections.
    </p>
    <p>If you’re just browsing around, these are some of my favorites:</p>
    <ul>
      <li>
        <a href="/">2012 San Francisco Mayor</a>
      </li>
      <li>
        <a href="/">2020 Santa Fe Mayor</a>
      </li>
    </ul>

    <p>
      ranked.vote is a project of
      <a href="/">Paul Butler</a>.
      For more information, see <a href="/about">the about page</a>.
    </p>
  </div>

  <div class="rightCol">
    <ElectionIndex {elections} />
  </div>
</div>
</div>