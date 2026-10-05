import { Component, Suspense, type ReactNode } from 'react';
import { Link, useParams } from 'react-router';
import { isPrototypeId, prototypes } from './registry';

class PrototypeErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() {
    return this.state.failed ? <div className="p-8" role="alert"><p>Unable to load this prototype.</p><button onClick={() => window.location.reload()}>Try again</button><Link className="ml-4" to="/templates">Back to showcase</Link></div> : this.props.children;
  }
}

export default function PrototypeRuntime() {
  const { prototypeId } = useParams();
  if (!isPrototypeId(prototypeId)) return <div className="p-8"><h1>Prototype not found</h1><Link to="/templates">Back to showcase</Link></div>;
  const Dashboard = prototypes[prototypeId].component;
  return <PrototypeErrorBoundary key={prototypeId}><Suspense fallback={<div className="flex min-h-screen items-center justify-center" role="status">Loading dashboard…</div>}><Dashboard /></Suspense></PrototypeErrorBoundary>;
}
