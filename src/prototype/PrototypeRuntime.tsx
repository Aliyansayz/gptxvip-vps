import { Component, Suspense, type ReactNode } from 'react';
import { Link, useParams } from 'react-router';
import { isPrototypeId, prototypes } from './registry';

class PrototypeErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() {
    return this.state.failed ? (
      <div className="p-8" role="alert">
        <p>Unable to load this prototype.</p>
        <button onClick={() => window.location.reload()}>Try again</button>
        <Link className="ml-4" to="/templates">Back to showcase</Link>
      </div>
    ) : this.props.children;
  }
}

export default function PrototypeRuntime() {
  const { prototypeId } = useParams();
  if (!isPrototypeId(prototypeId)) {
    return (
      <div className="p-8">
        <h1>Prototype not found</h1>
        <Link to="/templates">Back to showcase</Link>
      </div>
    );
  }
  const Dashboard = prototypes[prototypeId].component;

  const handleExit = () => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      window.location.assign('/templates');
    }
  };

  return (
    <PrototypeErrorBoundary key={prototypeId}>
      <div className="relative min-h-screen">
        {/* Universal Top-Right Floating Quick-Exit Control */}
        <div className="fixed top-3 right-4 z-50 pointer-events-auto print:hidden">
          <button
            type="button"
            onClick={handleExit}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-slate-700 bg-white/95 hover:bg-white hover:text-blue-600 shadow-md border border-slate-200/80 backdrop-blur-md transition-all hover:scale-105 active:scale-95 cursor-pointer"
            title="Exit prototype and return to templates"
            aria-label="Exit prototype"
          >
            <span aria-hidden="true">✕</span>
            <span>Exit</span>
          </button>
        </div>
        <Suspense fallback={<div className="flex min-h-screen items-center justify-center" role="status">Loading dashboard…</div>}>
          <Dashboard />
        </Suspense>
      </div>
    </PrototypeErrorBoundary>
  );
}
