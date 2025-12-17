<script lang="ts">
  import Heatmap from "./lib/components/Heatmap.svelte";
  import ProfileCard from "./lib/components/ProfileCard.svelte";
  import TechStack from "./lib/components/TechStack.svelte";
  import ActivityFeed from "./lib/components/ActivityFeed.svelte";

  import { api } from "./lib/api";
  import type { UserStatus } from "./lib/types";

  import { spotlight } from "./lib/actions/spotlight";

  // Static Configuration
  const staticUser = {
    username: "Xarth",
  };

  let status: UserStatus | null = $state(null);
  let quote = $state("");

  $effect(() => {
    api.getStatus().then((data) => (status = data));
    api.getQuote().then((data) => (quote = data.quote));
  });
</script>

<svelte:body use:spotlight />

<main
  class="flex gap-(--space-md) w-full items-start max-w-(--layout-max-width) max-[900px]:flex-col"
>
  <!-- Left Panel: Profile, Stats, Stack -->
  <div
    class="glass-panel flex-none w-(--layout-golden-ratio-left) flex flex-col gap-(--space-lg) p-(--space-lg) max-h-[calc(100vh-120px)] overflow-y-auto max-[900px]:flex-none max-[900px]:w-full max-[900px]:max-h-none max-[900px]:overflow-visible"
  >
    <div class="profile-section">
      <!-- Profile is always rendered (static), status is async -->
      <ProfileCard username={staticUser.username} {quote} {status} />
    </div>

    <div class="flex flex-col gap-(--space-sm)">
      <h3>Contribution Activity</h3>
      <Heatmap />
    </div>

    <div class="flex flex-col gap-(--space-sm)">
      <TechStack />
    </div>
  </div>

  <!-- Right Panel: Activity Feed -->
  <div
    class="glass-panel flex-1 p-(--space-lg) min-h-[600px] max-h-[calc(100vh-120px)] overflow-y-auto max-[900px]:flex-none max-[900px]:w-full max-[900px]:max-h-none max-[900px]:overflow-visible"
  >
    <h3>Latest Activity</h3>
    <ActivityFeed />
  </div>
</main>
