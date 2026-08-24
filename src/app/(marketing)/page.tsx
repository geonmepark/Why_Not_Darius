import { Hero } from '@/features/marketing/components/Hero';
import { RpsAnalogy } from '@/features/marketing/components/RpsAnalogy';
import { HowItWorks } from '@/features/marketing/components/HowItWorks';
import { LivePreview } from '@/features/marketing/components/LivePreview';
import { FeatureGrid } from '@/features/marketing/components/FeatureGrid';
import { Download } from '@/features/marketing/components/Download';
import { FaqAccordion } from '@/features/marketing/components/FaqAccordion';

export default function LandingPage() {
  return (
    <>
      <Hero />
      <RpsAnalogy />
      <HowItWorks />
      <LivePreview />
      <FeatureGrid />
      <Download />
      <FaqAccordion />
    </>
  );
}
