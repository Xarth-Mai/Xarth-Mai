<script lang="ts">
    import { api } from "../api";

    let contributions: number[] = $state([]);

    $effect(() => {
        api.getContributions().then((data) => (contributions = data.levels));
    });
</script>

<div class="heatmap-grid">
    {#if contributions.length > 0}
        {#each contributions as level}
            <div class="day level-{level}"></div>
        {/each}
    {:else}
        {#each Array(140) as _}
            <div class="day skeleton"></div>
        {/each}
    {/if}
</div>

<div class="legend">
    <span>Less</span>
    {#if contributions.length > 0}
        <div class="day level-0"></div>
        <div class="day level-1"></div>
        <div class="day level-2"></div>
        <div class="day level-3"></div>
        <div class="day level-4"></div>
    {:else}
        {#each Array(5) as _}
            <div class="day skeleton"></div>
        {/each}
    {/if}
    <span>More</span>
</div>

<style>
    .heatmap-grid {
        display: flex;
        flex-wrap: wrap;
        gap: 4px;
        margin-top: 16px;
        /* Simplification: Just a flex wrap box for now, standard GH graph is column-major grid */
        height: 140px;
        align-content: flex-start;
    }

    .day {
        width: 12px;
        height: 12px;
        border-radius: 2px;
        background-color: rgba(255, 255, 255, 0.05);
    }

    /* Dynamic scales using accent color */
    .level-0 {
        background-color: rgba(255, 255, 255, 0.05);
    }
    .level-1 {
        background-color: var(--color-accent-primary);
        opacity: 0.2;
    }
    .level-2 {
        background-color: var(--color-accent-primary);
        opacity: 0.4;
    }
    .level-3 {
        background-color: var(--color-accent-primary);
        opacity: 0.7;
    }
    .level-4 {
        background-color: var(--color-accent-primary);
        opacity: 1;
        box-shadow: 0 0 6px var(--color-accent-primary);
    }

    .legend {
        margin-top: auto;
        display: flex;
        align-items: center;
        gap: 6px;
        font-size: 12px;
        color: var(--color-text-secondary);
        justify-content: flex-end;
    }
</style>
