import ClientLogoutButton from "@/components/ClientLogoutButton";
import "../globals.css";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  // SidebarTrigger,
} from "@/components/ui/sidebar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <SidebarProvider>
          <AppSidebar />
          <SidebarInset>
            <ClientLogoutButton />
            {children}
          </SidebarInset>
        </SidebarProvider>
      </body>
    </html>
  );
}
