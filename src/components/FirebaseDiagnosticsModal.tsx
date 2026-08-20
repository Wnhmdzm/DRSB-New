import React, { useState } from 'react';
import {
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  Copy,
  Check,
  ExternalLink,
  RefreshCw,
  X,
  Database,
  Cloud,
  Laptop
} from 'lucide-react';
import { testFirestoreConnection, FirestoreConnectionResult } from '../firebase';

interface FirebaseDiagnosticsModalProps {
  isOpen: boolean;
  onClose: () => void;
  lastError?: string | null;
  onRefreshSync?: () => void;
}

export const FirebaseDiagnosticsModal: React.FC<FirebaseDiagnosticsModalProps> = ({
  isOpen,
  onClose,
  lastError,
  onRefreshSync
}) => {
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<FirestoreConnectionResult | null>(null);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleTestConnection = async () => {
    setTesting(true);
    try {
      const res = await testFirestoreConnection();
      setTestResult(res);
      if (res.ok && onRefreshSync) {
        onRefreshSync();
      }
    } catch (e) {
      setTestResult({
        ok: false,
        message: e instanceof Error ? e.message : 'Unknown connection error'
      });
    } finally {
      setTesting(false);
    }
  };

  const firestoreRulesSnippet = `rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}`;

  const handleCopyRules = () => {
    navigator.clipboard.writeText(firestoreRulesSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="bg-slate-900 text-white px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600/30 border border-blue-400/30 flex items-center justify-center text-blue-400">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold tracking-tight">Firebase Cloud Sync Diagnostics</h2>
              <p className="text-xs text-slate-400">
                Multi-Laptop Live Data Sharing • Project: <span className="text-blue-400 font-mono font-semibold">drsb-emt</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* Quick Explanation Banner */}
          <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 text-xs flex items-start gap-3">
            <Laptop className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-sm block mb-0.5">Why multi-laptop sync requires Firebase Rules</span>
              When you edit on Laptop 1, the changes are saved to Firebase Firestore in the cloud. Other laptops automatically listen to these cloud updates. If your Firebase Console has default closed rules (<code className="bg-blue-100 px-1 py-0.5 rounded font-mono">allow read, write: if false;</code>), edits cannot reach the cloud.
            </div>
          </div>

          {/* Connection Test Section */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Cloud className="w-4 h-4 text-slate-600" />
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">Cloud Connection Check</span>
              </div>
              <button
                onClick={handleTestConnection}
                disabled={testing}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-xs font-bold transition-all disabled:opacity-50 cursor-pointer shadow-xs"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${testing ? 'animate-spin' : ''}`} />
                {testing ? 'Testing Connection...' : 'Test Connection Now'}
              </button>
            </div>

            {testResult && (
              <div
                className={`p-3 rounded-lg text-xs border flex items-start gap-2.5 ${
                  testResult.ok
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                    : 'bg-rose-50 border-rose-200 text-rose-900'
                }`}
              >
                {testResult.ok ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                )}
                <div>
                  <span className="font-bold block">
                    {testResult.ok ? 'Connection Verified & Active' : 'Firestore Access Blocked'}
                  </span>
                  <p className="mt-0.5 text-slate-700">{testResult.message}</p>
                </div>
              </div>
            )}

            {lastError && !testResult && (
              <div className="p-3 rounded-lg text-xs bg-amber-50 border border-amber-200 text-amber-900 flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block">Recent Sync Warning</span>
                  <p className="mt-0.5 font-mono text-[11px] break-all">{lastError}</p>
                </div>
              </div>
            )}
          </div>

          {/* How to Fix Step-by-Step Guide */}
          <div className="space-y-3">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
              <span>Required 2-Minute Setup in Firebase Console</span>
            </h3>

            <ol className="space-y-3 text-xs text-slate-700 list-decimal list-inside pl-1">
              <li className="leading-relaxed">
                Open your Firebase Project Console:{' '}
                <a
                  href="https://console.firebase.google.com/project/drsb-emt/firestore/rules"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 underline font-semibold inline-flex items-center gap-1 ml-1"
                >
                  Firebase Console Rules Page <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li className="leading-relaxed">
                Click on <strong>Firestore Database</strong> in the left sidebar, then click the <strong>Rules</strong> tab at the top.
                <span className="block text-[11px] text-slate-500 mt-0.5">
                  (Note: If you have not created the database yet, click "Create database", choose your region, and start in test mode).
                </span>
              </li>
              <li className="leading-relaxed">
                Replace the contents in the Rules editor with the code below and click <strong className="text-blue-600">Publish</strong>:
              </li>
            </ol>

            {/* Code Snippet Box */}
            <div className="relative rounded-xl bg-slate-900 text-slate-100 p-3.5 font-mono text-xs shadow-inner">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800 text-[10px] text-slate-400">
                <span>firestore.rules</span>
                <button
                  onClick={handleCopyRules}
                  className="flex items-center gap-1 px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors cursor-pointer"
                >
                  {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  {copied ? 'Copied to Clipboard' : 'Copy Code'}
                </button>
              </div>
              <pre className="overflow-x-auto text-[11px] leading-relaxed text-emerald-400 font-mono">
                {firestoreRulesSnippet}
              </pre>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 px-6 py-3.5 border-t border-slate-200 flex items-center justify-between">
          <span className="text-[11px] text-slate-500">
            Changes take effect across all browsers within 5 seconds of publishing rules.
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
          >
            Close Diagnostics
          </button>
        </div>
      </div>
    </div>
  );
};
