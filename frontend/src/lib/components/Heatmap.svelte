<script lang="ts">
    import { api } from "../api";

    let contributions: number[] = $state([]);

    $effect(() => {
        api.getContributions().then((data) => (contributions = data.levels));
    });

    function getLevelClass(level: number) {
        switch (level) {
            case 1:
                return "bg-accent-primary/20";
            case 2:
                return "bg-accent-primary/40";
            case 3:
                return "bg-accent-primary/70";
            case 4:
                return "bg-accent-primary shadow-[0_0_6px_var(--color-accent-primary)]";
            default:
                return "bg-bg-input";
        }
    }
</script>

<div class="flex flex-wrap gap-1 mt-4 h-[140px] content-start">
    {#if contributions.length > 0}
        {#each contributions as level}
            <div class="w-3 h-3 rounded-[2px] {getLevelClass(level)}"></div>
        {/each}
    {:else}
        {#each Array(140) as _}
            <div class="w-3 h-3 rounded-[2px] bg-bg-input animate-pulse"></div>
        {/each}
    {/if}
</div>

<div
    class="mt-auto flex items-center gap-1.5 text-xs text-text-secondary justify-end"
>
    <span>Less</span>
    {#if contributions.length > 0}
        <div class="w-3 h-3 rounded-[2px] {getLevelClass(0)}"></div>
        <div class="w-3 h-3 rounded-[2px] {getLevelClass(1)}"></div>
        <div class="w-3 h-3 rounded-[2px] {getLevelClass(2)}"></div>
        <div class="w-3 h-3 rounded-[2px] {getLevelClass(3)}"></div>
        <div class="w-3 h-3 rounded-[2px] {getLevelClass(4)}"></div>
    {:else}
        {#each Array(5) as _}
            <div class="w-3 h-3 rounded-[2px] bg-bg-input animate-pulse"></div>
        {/each}
    {/if}
    <span>More</span>
</div>
