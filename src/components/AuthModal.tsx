import React, { useState } from 'react';
import { User, UserRole } from '../types';
import { X, ShieldCheck, UserCheck, Key, Lock, Sparkles, Building, Mail } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
  users: User[];
  onSelectUser: (user: User) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  users,
  onSelectUser
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<UserRole>('Admin (Incident Commander)');
  const [department, setDepartment] = useState('ECC / DIALOG Tower');
  const [mode, setMode] = useState<'quick' | 'custom'>('quick');

  if (!isOpen) return null;

  const handleCustomLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !name) return;

    const newUser: User = {
      id: Date.now().toString(),
      name,
      email,
      role,
      department,
      avatar: name.slice(0, 2).toUpperCase()
    };

    onSelectUser(newUser);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] bg-slate-900/30 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white/95 backdrop-blur-2xl border border-slate-200/80 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden ring-1 ring-slate-900/10">
        {/* Header */}
        <div className="bg-slate-50/90 px-5 py-3.5 border-b border-slate-200/80 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-200/80 flex items-center justify-center text-blue-600">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-tight">
                SECURE AUTHENTICATION & RBAC CONTROL
              </h3>
              <p className="text-[11px] text-slate-500 font-medium">
                Dialog Resources Emergency Management Team Access
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 transition-all">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-4 text-xs">
          {/* Mode Tabs */}
          <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200/80 font-bold">
            <button
              onClick={() => setMode('quick')}
              className={`flex-1 py-2 rounded-xl text-center transition-all ${
                mode === 'quick' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Quick Persona Switcher
            </button>
            <button
              onClick={() => setMode('custom')}
              className={`flex-1 py-2 rounded-xl text-center transition-all ${
                mode === 'custom' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Custom Auth Login
            </button>
          </div>

          {mode === 'quick' ? (
            <div className="space-y-3">
              <p className="text-slate-600 font-medium">
                Select a verified EMT persona to test Role-Based Access Control (RBAC):
              </p>

              <div className="space-y-2">
                {users.map((u) => {
                  const isCurrent = u.id === currentUser.id;
                  return (
                    <button
                      key={u.id}
                      onClick={() => {
                        onSelectUser(u);
                        onClose();
                      }}
                      className={`w-full text-left p-3 rounded-2xl border transition-all flex items-center justify-between ${
                        isCurrent
                          ? 'bg-blue-50/80 border-blue-300 shadow-xs ring-1 ring-blue-500/20'
                          : 'bg-slate-50 border-slate-200/80 hover:border-slate-300 hover:bg-white'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-blue-600 border border-blue-300 flex items-center justify-center font-extrabold text-white text-xs shadow-xs">
                          {u.avatar || u.name.slice(0, 2)}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 text-xs flex items-center gap-2">
                            <span>{u.name}</span>
                            {isCurrent && (
                              <span className="bg-emerald-50 text-emerald-700 border border-emerald-200/80 px-1.5 py-0.5 rounded-md text-[9px] font-mono font-bold">
                                Active Session
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-blue-600 font-bold">{u.role}</div>
                          <div className="text-[10px] text-slate-500 font-medium">{u.department} • {u.email}</div>
                        </div>
                      </div>
                      <UserCheck className={`w-4 h-4 ${isCurrent ? 'text-blue-600' : 'text-slate-400'}`} />
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            <form onSubmit={handleCustomLogin} className="space-y-3">
              <div>
                <label className="block text-slate-600 font-medium mb-1">Full Name:</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ir. Ahmad Zaim"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:bg-white focus:border-blue-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">Email Address:</label>
                <input
                  type="email"
                  required
                  placeholder="name@dialog.my"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:bg-white focus:border-blue-500 transition-all font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">Password:</label>
                <input
                  type="password"
                  required
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:bg-white focus:border-blue-500 transition-all font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">Assigned Role (RBAC):</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as UserRole)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 font-bold focus:outline-none focus:bg-white focus:border-blue-500 transition-all"
                >
                  <option value="Admin (Incident Commander)">Admin (Incident Commander) - Full Access</option>
                  <option value="Editor (Operations Chief)">Editor (Operations Chief) - Edit Database</option>
                  <option value="Viewer (Observer)">Viewer (Observer) - Read-Only Dashboard</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">Department / Command Unit:</label>
                <input
                  type="text"
                  placeholder="e.g. ECC / Miri Operations"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:bg-white focus:border-blue-500 transition-all"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-xl shadow-xs transition-all mt-2"
              >
                Sign In & Launch Session
              </button>
            </form>
          )}

          {/* Role Capabilities Summary */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3 text-[11px] text-slate-600 space-y-1">
            <div className="font-bold text-blue-700 uppercase">Current Session Permissions:</div>
            <div className="text-slate-700 font-medium">
              {currentUser.role.includes('Admin') ? (
                <span className="text-emerald-700 font-bold">Full Admin: Edit Excel Database, issue SITREPs, manage actions, vessel dispatch.</span>
              ) : currentUser.role.includes('Editor') ? (
                <span className="text-blue-700 font-bold">Editor: Modify action tracker rows, update telemetry, log timeline events.</span>
              ) : (
                <span className="text-amber-800 font-bold">Viewer: Read-only live telemetry monitoring and interactive filtering.</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
