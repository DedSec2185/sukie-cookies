import Navbar from './components/Navbar'
import Hero from './components/Hero'
import MarqueeTicker from './components/MarqueeTicker'
import Craftsmanship from './components/Craftsmanship'
import TastingNotes from './components/TastingNotes'
import PackagingExperience from './components/PackagingExperience'
import Menu from './components/Menu'
import ValueProps from './components/ValueProps'
import About from './components/About'
import Contact from './components/Contact'
import Footer from './components/Footer'
import Cart from './components/Cart'

function App() {
  return (
    <div className="min-h-screen bg-brand-cream selection:bg-brand-gold selection:text-brand-dark overflow-x-hidden">
      <Navbar />
      <Cart />
      <main>
        <Hero />
        <MarqueeTicker />
        <Craftsmanship />
        <TastingNotes />
        <PackagingExperience />
        <Menu />
        <ValueProps />
        <About />
        <Contact />
      </main>
      <Footer />
    </div>
  )
}

export default App
