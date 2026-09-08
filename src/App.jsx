import { useEffect } from 'react'
import { Navigate, Route, Routes, useLocation, useNavigationType } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { useStore } from './store/app'
import Home from './pages/Home'
import Shop from './pages/Shop'
import Product from './pages/Product'
import Favorites from './pages/Favorites'
import Help from './pages/Help'
import Admin from './pages/Admin'
import AdminProductForm from './pages/AdminProductForm'
import AdminCategories from './pages/AdminCategories'
import AdminSettings from './pages/AdminSettings'
import BottomNav from './components/BottomNav'
import Toaster from './components/Toaster'
import OfflineBanner from './components/OfflineBanner'

function Page({ children }) {
  return (
    <motion.main
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className="mx-auto min-h-screen w-full max-w-lg"
    >
      {children}
    </motion.main>
  )
}

export default function App() {
  const location = useLocation()
  const navType = useNavigationType()
  const theme = useStore((s) => s.theme)
  const setOnline = useStore((s) => s.setOnline)
  const toast = useStore((s) => s.toast)
  const setInstallEvent = useStore((s) => s.setInstallEvent)

  // keep <html> class in sync with theme state
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }, [theme])

  // connectivity + install prompt
  useEffect(() => {
    const onOnline = () => {
      setOnline(true)
      toast('Back online', '🌐')
    }
    const onOffline = () => setOnline(false)
    const onInstall = (e) => {
      e.preventDefault()
      setInstallEvent(e)
    }
    window.addEventListener('online', onOnline)
    window.addEventListener('offline', onOffline)
    window.addEventListener('beforeinstallprompt', onInstall)
    return () => {
      window.removeEventListener('online', onOnline)
      window.removeEventListener('offline', onOffline)
      window.removeEventListener('beforeinstallprompt', onInstall)
    }
  }, [])

  // scroll management: reset on new navigation, preserve on back
  useEffect(() => {
    if (navType !== 'POP') window.scrollTo({ top: 0 })
  }, [location.pathname, navType])

  return (
    <>
      <OfflineBanner />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Page><Home /></Page>} />
          <Route path="/shop" element={<Page><Shop /></Page>} />
          <Route path="/product/:id" element={<Page><Product /></Page>} />
          <Route path="/favorites" element={<Page><Favorites /></Page>} />
          <Route path="/help" element={<Page><Help /></Page>} />
          <Route path="/admin" element={<Page><Admin /></Page>} />
          <Route path="/admin/new" element={<Page><AdminProductForm /></Page>} />
          <Route path="/admin/edit/:id" element={<Page><AdminProductForm /></Page>} />
          <Route path="/admin/categories" element={<Page><AdminCategories /></Page>} />
          <Route path="/admin/settings" element={<Page><AdminSettings /></Page>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AnimatePresence>
      <BottomNav />
      <Toaster />
    </>
  )
}
