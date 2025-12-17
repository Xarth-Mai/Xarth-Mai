<script lang="ts">
    import { api } from "../api";
    import type { TechStackItem } from "../types";

    let stack: TechStackItem[] = $state([]);

    $effect(() => {
        api.getTechStack().then((data) => (stack = data));
    });
</script>

<div class="glass-panel h-full p-(--space-lg) flex flex-col gap-(--space-md)">
    <h3>Top Technologies</h3>

    <div class="min-h-[96px] relative">
        <div
            class="grid grid-rows-[0fr] transition-[grid-template-rows] duration-500 ease-out"
            class:grid-rows-[1fr]={stack.length > 0}
        >
            <div class="min-h-0">
                {#each stack as tech}
                    <div
                        class="flex items-center gap-(--space-sm) text-sm mb-(--space-sm)"
                    >
                        <span class="min-w-[50px]">{tech.name}</span>
                        <div
                            class="flex-1 h-2 bg-bg-input rounded overflow-hidden"
                        >
                            <div
                                class="h-full rounded transition-[width] duration-1000 ease-out"
                                style="width: {tech.percent}%; background-color: {tech.color};"
                            ></div>
                        </div>
                        <span
                            class="min-w-[30px] text-right text-text-secondary text-xs"
                            >{tech.percent}%</span
                        >
                    </div>
                {/each}
            </div>
        </div>

        {#if stack.length === 0}
            <!-- Skeleton Stack (Only visible when no stack) -->
            <div class="flex flex-col gap-4">
                {#each Array(4) as _}
                    <div class="skeleton w-full h-3 rounded-md"></div>
                {/each}
            </div>
        {/if}
    </div>
</div>
