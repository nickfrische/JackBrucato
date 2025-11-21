import Navigation from '@/components/public/Navigation';
import Footer from '@/components/public/Footer';
import AdminGuard from '@/components/admin/AdminGuard';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminGuard>
      <Navigation />
      <main>{children}</main>
      <Footer />
    </AdminGuard>
  );
}
