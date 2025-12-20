<script lang="ts">
    import type { ActivityItem } from "../types";

    let { activities = [] }: { activities: ActivityItem[] } = $props();
</script>

<div class="relative">
    <!-- Real Content with CSS grid transition -->
    <ul
        class="list-none p-0 mt-(--space-md) grid grid-rows-[0fr] transition-[grid-template-rows] duration-500 ease-out"
        class:grid-rows-[1fr]={activities.length > 0}
    >
        <div class="min-h-0">
            {#each activities as activity}
                <li
                    class="flex items-center gap-(--space-md) py-(--space-sm) border-b border-border last:border-b-0"
                >
                    <div
                        class="w-9 h-9 rounded-sm bg-bg-hover border box-border
                         {activity.type === 'push'
                            ? 'border-accent-primary'
                            : activity.type === 'pr'
                              ? 'border-[#a855f7]'
                              : 'border-[#eab308]'}"
                    ></div>
                    <div class="grow min-w-0">
                        <div class="font-medium text-sm text-text-primary">
                            {activity.repo}
                        </div>
                        <div
                            class="text-[13px] text-text-secondary whitespace-normal wrap-break-word"
                        >
                            {activity.desc}
                        </div>
                    </div>
                    <div class="text-xs text-text-secondary">
                        {activity.time}
                    </div>
                </li>
            {/each}
        </div>
    </ul>

    <!-- Skeleton (only visible when empty) -->
    {#if activities.length === 0}
        <ul class="list-none p-0 absolute top-0 left-0 right-0">
            {#each Array(9) as _}
                <li
                    class="flex items-center gap-(--space-md) py-(--space-sm) border-b border-border last:border-b-0"
                >
                    <div
                        class="w-9 h-9 rounded-sm bg-bg-hover skeleton border-0"
                    ></div>
                    <div class="grow min-w-0">
                        <div
                            class="skeleton mb-1"
                            style="width: 60%; height: 16px;"
                        ></div>
                        <div
                            class="skeleton"
                            style="width: 80%; height: 12px;"
                        ></div>
                    </div>
                    <div
                        class="skeleton"
                        style="width: 40px; height: 12px;"
                    ></div>
                </li>
            {/each}
        </ul>
    {/if}
</div>
