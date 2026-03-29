export const dynamic = "force-dynamic";

import { AppLayoutClient } from "@/components/app/app-layout-client";
import { DashboardContent } from "@/components/app/dashboard-content";

export default function DashboardPage() {
  return (
    <AppLayoutClient>
      <DashboardContent />
    </AppLayoutClient>
  );
}
