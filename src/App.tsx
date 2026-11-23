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
      <Header />
      <main>
        <Hero />
        <Approach />
        <Pricing />
        <Demo />
        <Faq />
        <Contact />
      </main>
      <Footer onOpenPrivacy={() => setPrivacyOpen(true)} />
      <CookieBanner />
      <PrivacyModal open={privacyOpen} onClose={() => setPrivacyOpen(false)} />
    </div>
  );
}
