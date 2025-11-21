import HeroSection from '@/components/public/HeroSection';
import AboutSection from '@/components/public/AboutSection';
import MonthlyBruSection from '@/components/public/MonthlyBruSection';
import PortfolioSection from '@/components/public/PortfolioSection';
import InterestsSection from '@/components/public/InterestsSection';
import NewsletterSection from '@/components/public/NewsletterSection';
import ContactSection from '@/components/public/ContactSection';

export default function Home() {
  return (
    <>
      <HeroSection />
      <AboutSection />
      <MonthlyBruSection />
      <PortfolioSection />
      <InterestsSection />
      <NewsletterSection />
      <ContactSection />
    </>
  );
}
