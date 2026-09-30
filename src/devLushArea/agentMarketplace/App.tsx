import { useEffect } from 'react'
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router'
import './catalog.css'
import Home from '@/pages/Home'
import Browse from '@/pages/Browse'
import TemplateDetail from '@/pages/TemplateDetail'
import LabRuntime from '@/pages/LabRuntime'
import { Navbar as RootNavbar } from '../../rootHomePage/Navbar'
import { Footer as RootFooter } from '../../rootHomePage/Footer'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [pathname])
  return null
}

export default function App() {
  const navigate = useNavigate()
  const location = useLocation()
  const isLabRuntime = location.pathname === '/lab' || location.pathname.startsWith('/lab/')

  return (
    <div className="agent-catalog flex min-h-screen flex-col bg-white text-slate-900">
      <ScrollToTop />
      {!isLabRuntime && <RootNavbar
        onNavigateFinhub={() => window.location.assign('/finhub')}
        onNavigateCodeConcepts={() => window.location.assign('/code_concepts/general')}
        onNavigateAgents={() => navigate('/')}
        onNavigateProjectSurfaces={() => navigate('/templates')}
        onNavigateBlogs={() => window.location.assign('/blogs')}
        onBookDemo={() => window.location.assign('mailto:aliyan@gptx.vip')}
        onSearch={(query) => navigate(query ? `/templates?q=${encodeURIComponent(query)}` : '/templates')}
        searchPlaceholder="Search project surfaces"
      />}
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/templates" element={<Browse />} />
          <Route path="/templates/:slug" element={<TemplateDetail />} />
          <Route path="/lab" element={<LabRuntime />} />
          <Route path="/lab/:topicSlug" element={<LabRuntime />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      {!isLabRuntime && <RootFooter
        onNavigateFinhub={() => window.location.assign('/finhub')}
        onNavigateCodeConcepts={() => window.location.assign('/code_concepts/general')}
        onNavigateDevLush={() => navigate('/')}
        onNavigateProjectSurfaces={() => navigate('/templates')}
        onNavigateAnalyticsSurfaces={() => navigate('/templates?category=Analytics')}
        onNavigateBlogs={() => window.location.assign('/blogs')}
      />}
    </div>
  )
}
