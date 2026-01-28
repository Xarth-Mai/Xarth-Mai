<script lang="ts">
    import type { UserStatus } from "../types";

    interface Props {
        username?: string;
        quote?: string;
        status?: UserStatus | null;
    }

    let { username = "", quote = "", status = null }: Props = $props();
    let imageLoaded = $state(false);
</script>

<div
    class="h-full p-(--space-lg) flex flex-col items-center text-center gap-(--space-sm)"
>
    <div class="relative w-20 h-20" style="aspect-ratio: 1/1;">
        <!-- Skeleton Avatar (Visible until loaded) -->
        {#if !imageLoaded}
            <div
                class="skeleton w-full h-full border-2 border-border box-border"
                style="border-radius: 50%;"
            ></div>
        {/if}

        <!-- Real Avatar (Hidden until loaded) -->
        <img
            src="/avatar.webp"
            alt={username}
            class="w-full h-full border-2 border-border object-cover transition-opacity duration-300 {imageLoaded
                ? 'opacity-100 relative'
                : 'opacity-0 absolute top-0 left-0'}"
            style="border-radius: 50%;"
            onload={() => (imageLoaded = true)}
        />

        {#if status}
            <div
                class="absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-bg-base transition-[background-color,box-shadow] duration-300"
                style="background-color: {status.color}; box-shadow: {status.pulse
                    ? `0 0 8px ${status.color}`
                    : 'none'}"
                title={status.label}
            ></div>
        {:else}
            <!-- Status Skeleton -->
            <div
                class="absolute bottom-0 right-0 w-4 h-4 rounded-full! border-2 border-bg-base skeleton"
            ></div>
        {/if}
    </div>

    <h2 class="font-semibold text-text-primary m-0">{username}</h2>

    {#if quote}
        <p
            class="my-1 text-sm min-h-[21px] leading-relaxed m-0 text-text-secondary"
        >
            {quote}
        </p>
    {:else}
        <!-- Quote Skeleton -->
        <div
            class="skeleton w-[180px] h-3.5 my-1 py-[3.5px] content-box bg-clip-content"
        ></div>
    {/if}

    <div class="mt-auto flex gap-(--space-sm)">
        <a
            href="https://github.com/Xarth-Mai/"
            target="_blank"
            rel="noopener noreferrer"
            class="px-4 py-2 rounded-xl bg-bg-input text-text-secondary no-underline cursor-pointer transition-all hover:bg-bg-hover hover:text-text-primary"
            >GitHub</a
        >
    </div>
</div>
