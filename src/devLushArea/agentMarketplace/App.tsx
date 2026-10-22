import { lazy, Suspense, useEffect } from 'react'
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router'
import './catalog.css'
import { labViewPaths, type LabView } from '../agentDevRootComponents/labViewRoutes'
import PrototypeRuntime from '../../prototype/PrototypeRuntime'
import { Navbar as RootNavbar } from '../../rootHomePage/Navbar'
import { Footer as RootFooter } from '../../rootHomePage/Footer'

const Home = lazy(() => import('@/pages/Home'))
const Browse = lazy(() => import('@/pages/Browse'))
const TemplateDetail = lazy(() => import('@/pages/TemplateDetail'))
const LabRuntime = lazy(() => import('@/pages/LabRuntime'))

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [pathname])
  return null
}

function ExternalRedirect({ to }: { to: string }) {
  useEffect(() => {
    window.location.replace(to);
  }, [to]);
  return null;
}

export default function App() {
  const navigate = useNavigate()
  const location = useLocation()
  const isWorkspaceRuntime = location.pathname === '/lab' || location.pathname.startsWith('/lab/') || location.pathname.startsWith('/prototypes/')

  return (
    <div className="agent-catalog flex min-h-screen flex-col bg-white text-slate-900">
      <ScrollToTop />
      {!isWorkspaceRuntime && <RootNavbar
        onNavigateFinhub={() => window.location.assign('/finhub')}
        onNavigateCodeConcepts={() => window.location.assign('/code_concepts/general')}
        onNavigateAgentWorkspace={() => window.location.assign('/workspace')}
        onNavigateAgents={() => navigate('/')}
        onNavigateProjectSurfaces={() => navigate('/templates')}
        onNavigateBlogs={() => window.location.assign('/blogs')}
        onBookDemo={() => window.location.assign('/contact')}
        onSearch={(query) => navigate(query ? `/templates?q=${encodeURIComponent(query)}` : '/templates')}
        searchPlaceholder="Search project surfaces"
      />}
      <main className="flex-1">
        <Suspense fallback={<div className="flex min-h-screen items-center justify-center" role="status">Loading workspace…</div>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/templates" element={<Browse />} />
          <Route path="/templates/:slug" element={<TemplateDetail />} />
          <Route path="/prototypes/:prototypeId" element={<PrototypeRuntime />} />
          <Route path="/lab/workspace" element={<ExternalRedirect to="/workspace" />} />
          <Route path="/workspace" element={<ExternalRedirect to="/workspace" />} />
          {Object.entries(labViewPaths).map(([view, path]) => (
            <Route key={path} path={path} element={<LabRuntime initialView={view as LabView} />} />
          ))}
          <Route path="/lab/:topicSlug/search" element={<LabRuntime />} />
          <Route path="/lab/:topicSlug/cases/:chapterId" element={<LabRuntime />} />
          <Route path="/lab/:topicSlug" element={<LabRuntime />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        </Suspense>
      </main>
      {!isWorkspaceRuntime && <RootFooter
        onNavigateFinhub={() => window.location.assign('/finhub')}
        onNavigateCodeConcepts={() => window.location.assign('/code_concepts/general')}
        onNavigateAgentWorkspace={() => window.location.assign('/workspace')}
        onNavigateDevLush={() => navigate('/')}
        onNavigateProjectSurfaces={() => navigate('/templates')}
        onNavigateAnalyticsSurfaces={() => navigate('/templates?category=Analytics')}
        onNavigateBlogs={() => window.location.assign('/blogs')}
      />}
    </div>
  )
}
