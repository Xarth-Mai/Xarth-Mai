<script lang="ts">
  import Heatmap from "./lib/components/Heatmap.svelte";
  import ProfileCard from "./lib/components/ProfileCard.svelte";
  import TechStack from "./lib/components/TechStack.svelte";
  import ActivityFeed from "./lib/components/ActivityFeed.svelte";

  import { api } from "./lib/api";
  import type { DashboardData } from "./lib/types";

  import { spotlight } from "./lib/actions/spotlight";

  // Static Configuration
  const staticUser = {
    username: "Xarth",
  };

  let dashboard: DashboardData | null = $state(null);

  $effect(() => {
    api.getDashboard().then((data) => (dashboard = data));
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
      <ProfileCard
        username={staticUser.username}
        quote={dashboard?.quote.quote ?? ""}
        status={dashboard?.status ?? null}
      />
    </div>

    <div class="flex flex-col gap-(--space-sm)">
      <h3>Contribution Activity</h3>
      <Heatmap contributions={dashboard?.contributions.levels ?? []} />
    </div>

    <div class="flex flex-col gap-(--space-sm)">
      <TechStack stack={dashboard?.stack ?? []} />
    </div>
  </div>

  <!-- Right Panel: Activity Feed -->
  <div
    class="glass-panel flex-1 p-(--space-lg) min-h-[600px] max-h-[calc(100vh-120px)] overflow-y-auto max-[900px]:flex-none max-[900px]:w-full max-[900px]:max-h-none max-[900px]:overflow-visible"
  >
    <h3>Latest Activity</h3>
    <ActivityFeed activities={dashboard?.activity ?? []} />
  </div>
</main>
