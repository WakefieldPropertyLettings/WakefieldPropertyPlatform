import AdminNavigation from "@/components/admin/AdminNavigation";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <AdminNavigation />
      {children}
    </>
  );
}