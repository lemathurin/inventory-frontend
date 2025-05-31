import ClientLogoutButton from "@/components/ClientLogoutButton";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <ClientLogoutButton />
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
