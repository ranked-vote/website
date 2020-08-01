<script type="ts">
  import type { ICandidatePairTable } from "../../report_types";
  import type { CandidateContext } from "../candidates";
  import { getContext } from "svelte";

  export let data: ICandidatePairTable;
  export let rowLabel: string;
  export let colLabel: string;

  const { getCandidate } = getContext("candidates") as CandidateContext;

  function smooth(low: number, high: number, frac: number): number {
    return low * (1 - frac) + high * frac;
  }

  let maxFrac = Math.max(
    ...data.entries.map((row) => Math.max(...row.map((d) => d?.frac || 0)))
  );

  function fracToColor(frac: number): string {
    frac = frac / maxFrac;
    let s = smooth(50, 74, frac);
    let l = smooth(100, 56, frac);

    return `hsl(0 ${s}% ${l}%)`;
  }
</script>

<style>
  table {
    font-size: 8pt;
    margin: auto;
  }

  .colLabel div {
    transform: rotate(180deg);
    writing-mode: vertical-lr;
    margin: auto;
  }

  .colLabel {
    vertical-align: bottom;
  }

  .rowLabel {
    text-align: right;
  }

  .entry {
    height: 40px;
    width: 40px;
    font-size: 8pt;
    vertical-align: middle;
    text-align: center;
    color: black;
  }

  .colsLabel {
    text-align: center;
    font-size: 10pt;
    font-weight: bold;
    padding-bottom: 20px;
  }

  .rowsLabel {
    font-size: 10pt;
    font-weight: bold;
    padding-right: 20px;
  }

  .rowsLabel div {
    transform: rotate(180deg);
    writing-mode: vertical-lr;
  }
</style>

<table>
  <tbody>
    <tr>
      <td colspan={2} rowspan={2} />
      <td class="colsLabel" colspan={data.cols.length}>{colLabel}</td>
    </tr>
    <tr>
      {#each data.cols as col}
        <td class="colLabel">
          <div>{getCandidate(col).name}</div>
        </td>
      {/each}
    </tr>
    {#each data.rows as row, i}
      <tr>
        {#if i == 0}
          <td class="rowsLabel" rowspan={data.rows.length}>
            <div>{rowLabel}</div>
          </td>
        {/if}
        <td class="rowLabel">{getCandidate(row).name}</td>
        {#each data.entries[i] as entry}
          <td class="entry" style={`background: ${fracToColor(entry?.frac)}`}>
            {#if entry}{Math.round(entry.frac * 1000) / 10}%{/if}
          </td>
        {/each}
      </tr>
    {/each}
  </tbody>
</table>
