import React, { useState } from 'react';
import { UserCog, Key, CheckCircle, XCircle, Database, Shield } from 'lucide-react';

type UserRole = 'guest' | 'user' | 'admin';

interface TokenPayload {
  userId: number;
  role: UserRole;
  exp: number;
}

export default function AuthFlawsSandbox() {
  const [tokenPayload, setTokenPayload] = useState<TokenPayload>({ userId: 101, role: 'user', exp: Math.floor(Date.now() / 1000) + 3600 });
  const [isSignatureChecked, setIsSignatureChecked] = useState(false);
  
  const handleRoleChange = (newRole: UserRole) => {
    setTokenPayload({ ...tokenPayload, role: newRole });
  };

  const handleIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTokenPayload({ ...tokenPayload, userId: parseInt(e.target.value) || 0 });
  };

  const activeRole = isSignatureChecked ? 'user' : tokenPayload.role; // If sig checked, manipulation fails, falls back to real role (user)

  return (
    <div className="w-full max-w-5xl mx-auto bg-slate-900 rounded-xl shadow-2xl overflow-hidden border border-slate-700 text-slate-200">
      <div className="bg-slate-800 border-b border-slate-700 p-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <UserCog className="w-5 h-5 text-purple-400" />
          <h2 className="text-lg font-bold font-mono">Auth Flaws Lab: Token Manipulation</h2>
        </div>
        <button 
          onClick={() => setIsSignatureChecked(!isSignatureChecked)}
          className={`px-3 py-1 text-xs font-semibold rounded-md border flex items-center gap-1 ${isSignatureChecked ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'bg-red-500/10 text-red-400 border-red-500/30'}`}
        >
          {isSignatureChecked ? 'Verify JWT Signatures: ON' : 'Verify JWT Signatures: OFF'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-0 min-h-[400px]">
        {/* Attacker Token Editor */}
        <div className="lg:col-span-1 p-6 border-r border-slate-700 bg-slate-950 flex flex-col">
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-slate-400 flex items-center gap-2 mb-2">
              <Key className="w-4 h-4" /> JWT Decoder/Editor
            </h3>
            <p className="text-xs text-slate-500">Edit the decoded payload to attempt privilege escalation.</p>
          </div>

          <div className="space-y-4 flex-1">
            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">"userId":</label>
              <input 
                type="number" 
                value={tokenPayload.userId} 
                onChange={handleIdChange}
                className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-slate-300 font-mono text-sm focus:border-purple-500 outline-none"
              />
              <p className="text-[10px] text-slate-500 mt-1">Try changing to ID 1 (often admin)</p>
            </div>
            
            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">"role":</label>
              <select 
                value={tokenPayload.role}
                onChange={(e) => handleRoleChange(e.target.value as UserRole)}
                className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-slate-300 font-mono text-sm focus:border-purple-500 outline-none"
              >
                <option value="guest">guest</option>
                <option value="user">user</option>
                <option value="admin">admin</option>
              </select>
            </div>
          </div>
          
          {isSignatureChecked && tokenPayload.role !== 'user' && (
            <div className="mt-4 p-3 bg-red-900/20 border border-red-500/30 rounded-lg flex items-start gap-2">
              <XCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
              <p className="text-xs text-red-400">Signature validation failed! The backend detected payload tampering and rejected the token.</p>
            </div>
          )}
        </div>

        {/* Target Application UI */}
        <div className="lg:col-span-2 p-6 bg-slate-900">
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-800">
            <h3 className="text-xl font-bold text-slate-200">Acme Corp Dashboard</h3>
            <div className="flex items-center gap-2 px-3 py-1 bg-slate-800 rounded-full border border-slate-700">
              <div className={`w-2 h-2 rounded-full ${activeRole === 'admin' ? 'bg-purple-500' : activeRole === 'user' ? 'bg-blue-500' : 'bg-slate-500'}`} />
              <span className="text-xs font-mono text-slate-400">Current Access Level: <strong className="text-slate-200 capitalize">{activeRole}</strong></span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Public Area */}
            <div className="bg-slate-800 rounded-xl p-5 border border-slate-700">
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle className="w-5 h-5 text-emerald-500" />
                <h4 className="font-semibold text-slate-300">Public Forums</h4>
              </div>
              <p className="text-xs text-slate-500">Accessible by all users and guests.</p>
              <div className="mt-4 space-y-2">
                <div className="h-2 bg-slate-700 rounded w-full"></div>
                <div className="h-2 bg-slate-700 rounded w-5/6"></div>
              </div>
            </div>

            {/* User Area */}
            <div className={`rounded-xl p-5 border transition-colors ${activeRole === 'user' || activeRole === 'admin' ? 'bg-slate-800 border-slate-700' : 'bg-slate-900/50 border-slate-800 opacity-50'}`}>
              <div className="flex items-center gap-2 mb-3">
                {activeRole === 'user' || activeRole === 'admin' ? <CheckCircle className="w-5 h-5 text-emerald-500" /> : <XCircle className="w-5 h-5 text-slate-600" />}
                <h4 className="font-semibold text-slate-300">My Profile (ID: {isSignatureChecked ? '101' : tokenPayload.userId})</h4>
              </div>
              <p className="text-xs text-slate-500">Accessible by logged-in users.</p>
              {activeRole === 'user' || activeRole === 'admin' ? (
                <div className="mt-4 p-3 bg-slate-900 rounded border border-slate-700 text-xs font-mono text-slate-400">
                  Welcome back, User {isSignatureChecked ? '101' : tokenPayload.userId}.
                  {tokenPayload.userId === 1 && !isSignatureChecked && <span className="block mt-2 text-purple-400">IDOR Success: Viewing Admin (ID 1) profile!</span>}
                </div>
              ) : (
                <div className="mt-4 flex items-center gap-2 text-xs text-red-400/50">
                  <Shield className="w-4 h-4" /> Access Denied
                </div>
              )}
            </div>

            {/* Admin Area */}
            <div className={`col-span-2 rounded-xl p-5 border transition-colors ${activeRole === 'admin' ? 'bg-purple-900/20 border-purple-500/30' : 'bg-slate-900/50 border-slate-800 opacity-50'}`}>
              <div className="flex items-center gap-2 mb-3">
                {activeRole === 'admin' ? <CheckCircle className="w-5 h-5 text-purple-500" /> : <XCircle className="w-5 h-5 text-slate-600" />}
                <h4 className="font-semibold text-slate-300 flex items-center gap-2"><Database className="w-4 h-4" /> Admin Control Panel</h4>
              </div>
              <p className="text-xs text-slate-500">Strictly accessible by administrators only.</p>
              
              {activeRole === 'admin' ? (
                <div className="mt-4 grid grid-cols-3 gap-3">
                  <button className="py-2 bg-purple-600 hover:bg-purple-700 text-white rounded text-xs font-medium transition-colors">Manage Users</button>
                  <button className="py-2 bg-purple-600 hover:bg-purple-700 text-white rounded text-xs font-medium transition-colors">View System Logs</button>
                  <button className="py-2 bg-purple-600 hover:bg-purple-700 text-white rounded text-xs font-medium transition-colors">Database Settings</button>
                </div>
              ) : (
                <div className="mt-6 flex flex-col items-center justify-center text-slate-600 pb-4">
                  <Shield className="w-8 h-8 mb-2 opacity-50" />
                  <p className="text-sm font-medium">Insufficient Privileges</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
