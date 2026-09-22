import Navbar from './components/Navbar'
import Hero from './components/Hero'
import MarqueeTicker from './components/MarqueeTicker'
import Menu from './components/Menu'
import PackagingExperience from './components/PackagingExperience'
import Craftsmanship from './components/Craftsmanship'
import TastingNotes from './components/TastingNotes'
import About from './components/About'
import Contact from './components/Contact'
import Footer from './components/Footer'
import Cart from './components/Cart'
import FloatingMobileCart from './components/FloatingMobileCart'

function App() {
  return (
    <div className="min-h-screen bg-brand-cream selection:bg-brand-gold selection:text-brand-dark overflow-x-hidden">
      <Navbar />
      <Cart />
      <FloatingMobileCart />
      
      <main>
        {/* 1. Hero */}
        <Hero />

        {/* 2. Brand Ticker */}
        <MarqueeTicker />

        {/* 3. The Core Collection (Immediate Mobile Access) */}
        <Menu />

        {/* 4. Packaging & Gifting Experience */}
        <PackagingExperience />

        {/* 5. The Culinary Craft & Anatomy */}
        <Craftsmanship />

        {/* 6. The Tasting Room Bar */}
        <TastingNotes />

        {/* 7. Story & Atelier */}
        <About />

        {/* 8. Delivery & Ordering */}
        <Contact />
      </main>

      <Footer />
    </div>
  )
}

export default App
