export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Minimal server layout - no CF context needed
  // Client-side auth handled by AppLayoutClient loaded from page
  return (
    <div id="app-root">
      {children}
    </div>
  );
}
