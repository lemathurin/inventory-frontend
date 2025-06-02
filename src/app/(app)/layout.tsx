import ClientLogoutButton from "@/components/ClientLogoutButton";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { UserProvider } from "@/contexts/user.context";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <UserProvider>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <ClientLogoutButton />
          {children}
        </SidebarInset>
      </SidebarProvider>
    </UserProvider>
  );
}
