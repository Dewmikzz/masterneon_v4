import { Routes, Route } from 'react-router-dom'
import SiteLayout from './components/layout/SiteLayout'
import ScrollToTop from './components/common/ScrollToTop'
import HomePage from './pages/HomePage'
import BuilderPage from './pages/BuilderPage'
import AboutPage from './pages/AboutPage'
import ContactPage from './pages/ContactPage'
import ShowcasePage from './pages/ShowcasePage'

const App = () => (
  <>
    <ScrollToTop />
    <Routes>
      <Route element={<SiteLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/builder" element={<BuilderPage />} />
        <Route path="/showcase" element={<ShowcasePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
      </Route>
    </Routes>
  </>
)

export default App
