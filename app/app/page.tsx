export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

import { AppLayoutClient } from "@/components/app/app-layout-client";
import { DashboardContent } from "@/components/app/dashboard-content";

export default function DashboardPage() {
  return (
    <AppLayoutClient>
      <DashboardContent />
    </AppLayoutClient>
  );
}
