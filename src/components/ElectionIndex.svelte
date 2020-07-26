<script type="ts">
  import Index from "../routes/index.svelte";
  export let elections;

  let electionsByYear = new Map();

  elections.forEach((e) => {
    let year = e.date.substr(0, 4);
    if (!electionsByYear.has(year)) {
      electionsByYear.set(year, []);
    }
    electionsByYear.get(year).push(e);
  });
</script>

{#each [...electionsByYear] as [year, elections]}
  <div class="yearSection">
    <h2>{year}</h2>
    <div class="electionSection">
    {#each elections as election}
        <div class="electionHeader">
          <h3>
            <strong>{election.jurisdictionName}</strong>
            {election.electionName}
          </h3>
        </div>
        {#each election.contests as contest}
        <div class="race">
          <a href="/">
            <div class="title">
              <strong>{contest.officeName}</strong>
              {contest.winner}
            </div>
            <div class="meta">
              <strong>{contest.numCandidates}</strong>
              candidates,
              <strong>{contest.numRounds}</strong>
              rounds
            </div>
          </a>
        </div>
        {/each}
    {/each}
  </div>
  </div>
{/each}
