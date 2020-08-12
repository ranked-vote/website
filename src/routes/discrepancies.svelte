<title>ranked.vote: Understanding Discrepancies</title>

<div class="container">
<div class="description">
  <h1><a href="/">ranked.vote</a>: Understanding Discrepancies</h1>
</div>

<p>
  All of the analysis that goes into ranked.vote reports is based only
  on ballot-level data. This includes the IRV tabulation, which backs
  the “Runoff Rounds” section.
</p>

<p>
  In some cases, these tabulations don't match the official tabulations.
  There are two main reasons for this. First, there are multiple ways to
  tabluate an instant-runoff election. The main decisions are:
</p>

<ul>
  <li>
    Whether you remove a single candidate on each round, or all remaining
    candidates who are mathematically unable to win.
  </li>
  <li>
    Whether you stop eliminations when it is clear that one candidate has
    won, or whether you continue eliminating until only two candidates remain.
  </li>
</ul>

<p>
  These result in the same winner, but the count at each round may differ.
  For consistency and information density, we tabulate all elections the same
  way: all candidates who are unable to win are removed at each round, and
  we continue until two candidates remain.
</p>

<p>
  Another source of discrepancies is the handling of undervotes/overvotes and
  write-ins.
  To the extent possible, we follow the statutes in the relevant jurisdiction
  in order to treat ballots the same way that the elections
  board does. But statues aren't code, so there are sometimes cases
  where there are ambiguities around edge cases. In particular, the treatment
  of write-in candidates can be a complicating factor, because many jurisdictions
  replace them with a generic “write in” dummy candidate, which does not always
  reflect how they are treated in the official tabulation.
</p>

</div>