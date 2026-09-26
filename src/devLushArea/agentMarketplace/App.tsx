import { useEffect } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router'
import './catalog.css'
import SiteHeader from '@/components/SiteHeader'
import SiteFooter from '@/components/SiteFooter'
import Home from '@/pages/Home'
import Browse from '@/pages/Browse'
import TemplateDetail from '@/pages/TemplateDetail'
import LabRuntime from '@/pages/LabRuntime'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [pathname])
  return null
}

export default function App() {
  return (
    <div className="agent-catalog flex min-h-screen flex-col bg-white text-slate-900">
      <ScrollToTop />
      <SiteHeader />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/templates" element={<Browse />} />
          <Route path="/templates/:slug" element={<TemplateDetail />} />
          <Route path="/lab" element={<LabRuntime />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <SiteFooter />
    </div>
  )
}
