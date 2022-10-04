

<script>
  import { base } from '$app/paths';
  import ElectionIndex from "../components/ElectionIndex.svelte";
  export let elections;
</script>

<title>approval.vote: detailed reports on approval voting elections.</title>

<div class="wide container">
<div class="row">
  <div class="leftCol">
    <div class="description">
      <h1>approval.vote</h1>:
      detailed reports on approval voting elections.
    </div>
    <p>
      Approval voting elections produce more data on voter preferences than
      pick-one elections. <strong>approval.vote</strong> runs analysis on the
      ballot-level data and publishes reports on each election.
    </p>

    <p>
      <strong>approval.vote</strong> is a project of
         <a href="https://felixsargent.com">Felix Sargent</a>. It is a fork of <a href="https://paulbutler.org">Paul Butler's</a> <a href="https://ranked.vote">ranked.vote</a>.
        It is non-partisan and has received no outside funding.
      For more information, see <a href="{ base }/about">the about page</a>.
    </p>
  </div>

  <div class="rightCol">
    <ElectionIndex {elections} />
  </div>
</div>
</div>