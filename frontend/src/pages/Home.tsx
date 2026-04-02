
import { Navbar } from '../components/Navbar';
import { HeroSection } from '../components/HeroSection';
import { AnimatedFeatureSection } from '../components/AnimatedFeatureSection';
import { FeaturesBento } from '../components/FeaturesBento';
import { CTASection } from '../components/CTASection';
import { Footer } from '../components/Footer';

export const Home = () => {
  return (
    <div className="min-h-screen bg-[#0a0a0c] font-sans text-zinc-50 selection:bg-[#5e43f3]/30">
      <Navbar />
      
      <main>
        <HeroSection />
        
        <AnimatedFeatureSection />

        <div id="features" className="bg-[#0a0a0c] relative border-t border-zinc-900/50">
          <div className="absolute inset-0 bg-linear-to-b from-zinc-900/20 to-transparent pointer-events-none" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-16 text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-5xl text-white">
              Everything you need. <span className="text-zinc-500">Nothing you don't.</span>
            </h2>
            <p className="mt-6 text-xl text-zinc-400 max-w-2xl mx-auto">
              A streamlined toolkit mirroring your workflow. Sessions, Goals, Skills, and Insights directly integrated into a single unified platform.
            </p>
          </div>
          <FeaturesBento />
        </div>
        
        <CTASection />
      </main>

      <Footer />
    </div>
  );
};
