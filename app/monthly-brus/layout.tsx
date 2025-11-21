import Navigation from '@/components/public/Navigation';
import Footer from '@/components/public/Footer';

export default function MonthlyBrusLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navigation />
      <main>{children}</main>
      <Footer />
    </>
  );
}
