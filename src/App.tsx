import { Dashboard } from './components/Dashboard';
import { AgentPanel } from './components/AgentPanel';

function App() {
  return (
    <div className="min-h-screen bg-slate-900 p-4">
      <div className="max-w-[1600px] mx-auto h-[calc(100vh-2rem)]">
        <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-4 h-full">
          <div className="h-full overflow-hidden bg-slate-800/50 rounded-xl border border-slate-700/50">
            <Dashboard />
          </div>
          <div className="h-full overflow-hidden bg-slate-800/50 rounded-xl border border-slate-700/50">
            <AgentPanel />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
