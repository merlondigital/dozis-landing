export const dynamic = "force-dynamic";
export const revalidate = 0;

import { AppLayoutClient } from "@/components/app/app-layout-client";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppLayoutClient>{children}</AppLayoutClient>;
}
