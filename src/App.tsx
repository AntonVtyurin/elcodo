import { useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Approach from './components/Approach';
import Pricing from './components/Pricing';
import Demo from './components/Demo';
import Faq from './components/Faq';
import Contact from './components/Contact';
import Footer from './components/Footer';
import CookieBanner from './components/CookieBanner';
import PrivacyModal from './components/PrivacyModal';

export default function App() {
  const [privacyOpen, setPrivacyOpen] = useState(false);

  return (
    <div className="min-h-screen bg-ink">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-amber-500 focus:px-4 focus:py-2 focus:text-sm focus:font-bold focus:text-[#090A0F]"
      >
        Перейти к основному содержанию
      </a>
      <Header />
      <main id="main-content">
        <Hero />
        <Approach />
        <Pricing />
        <Demo />
        <Faq />
        <Contact />
      </main>
      <Footer onOpenPrivacy={() => setPrivacyOpen(true)} />
      <CookieBanner onOpenPrivacy={() => setPrivacyOpen(true)} />
      <PrivacyModal open={privacyOpen} onClose={() => setPrivacyOpen(false)} />
    </div>
  );
}
