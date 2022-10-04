<script>import { base } from '$app/paths';</script>

<title>About approval.vote</title>

<div class="container">
<div class="description">
  <h1>About <a href="{base}/">approval.vote</a></h1>
</div>

<p>
  <a href="https://en.wikipedia.org/wiki/Approval_Voting">
    Approval Voting elections
  </a>
  produce a lot of data about voter preferences. Typically, this information is
  made available by election boards in specialized file formats and requires
  processing to interpret. The purpose of approval.vote is to increase transparency into these
  elections by creating detailed and intuitive reports about them.
</p>

<p>
  All reports are generated from the raw ballot data, rather than using the
  official tabulation. As a result, the reports also serve as an independent
  tabulation of the results that can be reproduced using published source code.
</p>

<p>
  approval.vote is maintained by
   <a href="https://felixsargent.com">Felix Sargent</a>. It is a fork from the original work of <a href="https://paulbutler.org">Paul Butler's</a> <a href="https://ranked.vote">ranked.vote</a>.
  It is non-partisan and has received no outside funding.
</p>

<h2>License</h2>

<p>
  This website and the data pipeline behind it (including the tabulator) are
  <a href="https://github.com/electionscience/approval-vote">open source</a> and liberally licensed. Website content and generated reports may
  be freely distributed with attribution under the <a href="https://creativecommons.org/licenses/by/2.0/">CC-BY</a> license.
</p>

<h2>Colophon</h2>

<p>
  The <a href="https://github.com/electionscience/approval-vote">data pipeline</a> for approval.vote was written in <a href="https://www.rust-lang.org/">Rust</a>. This website, including
  visualizations, was created with Sapper and <a href="https://svelte.dev/">Svelte</a>, and is hosted on <a href="https://www.netlify.com/">Netlify</a>.
  The font is <a href="https://github.com/adobe-fonts/source-sans-pro">Source Sans Pro</a>.
</p>
</div>
