import {
  Header,
  Hero,
  HowItWorks,
  Benefits,
  Segments,
  Reliability,
  SocialProof,
  Simulator,
  FAQ,
  Pricing,
  FinalCTA,
  Footer,
} from '../presentation/components/landing';

export default function LandingPage() {
  return (
    <div className="bg-white dark:bg-gray-900">
      <Header />
      <main>
        <Hero />
        <HowItWorks />
        <Benefits />
        <Segments />
        <Reliability />
        <SocialProof />
        <Simulator />
        <FAQ />
        <Pricing />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}
