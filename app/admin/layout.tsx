import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

const authorisedAdminEmails = [
  "admin@wakefieldpropertylettings.co.uk",
];

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}