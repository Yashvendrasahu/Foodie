import React, { useState } from 'react';
import {
  isSupabaseConfigured,
  supabaseUrl,
  supabaseAnonKey,
  setSupabaseCredentials,
  clearSupabaseCredentials
} from '../lib/supabaseClient.js';
import {
  Database, CheckCircle2, AlertCircle, Key, Globe, Copy, Check,
  X, ExternalLink, RefreshCw, ShieldCheck
} from 'lucide-react';

export default function SupabaseConnectionModal({ isOpen, onClose }) {
  const [urlInput, setUrlInput] = useState(supabaseUrl || '');
  const [keyInput, setKeyInput] = useState(supabaseAnonKey || '');
  const [copiedSchema, setCopiedSchema] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState(null);

  if (!isOpen) return null;

  const handleSave = (e) => {
    e.preventDefault();
    if (!urlInput.trim() || !keyInput.trim()) {
      alert('Please provide both Supabase Project URL and Anon Public Key.');
      return;
    }
    setSupabaseCredentials(urlInput.trim(), keyInput.trim());
  };

  const handleClear = () => {
    if (confirm('Clear Supabase configuration and revert to local fallback?')) {
      clearSupabaseCredentials();
    }
  };

  const copySqlSchema = () => {
    const schemaNotice = `-- Copy and run supabase-schema.sql in your Supabase SQL editor to create all tables and policies.`;
    navigator.clipboard?.writeText(schemaNotice);
    setCopiedSchema(true);
    setTimeout(() => setCopiedSchema(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden space-y-5 p-6 sm:p-8">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-700 text-white flex items-center justify-center shadow-md">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-lg text-slate-900 leading-tight">
                Supabase Backend Connection
              </h3>
              <p className="text-xs text-slate-500">
                Direct Client-Side PostgreSQL & Authentication
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Connection Status */}
        <div className={`p-4 rounded-2xl border flex items-start gap-3 ${
          isSupabaseConfigured
            ? 'bg-emerald-50/80 border-emerald-200 text-emerald-900'
            : 'bg-amber-50/80 border-amber-200 text-amber-900'
        }`}>
          {isSupabaseConfigured ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          )}
          <div className="space-y-1 text-xs">
            <div className="font-bold">
              {isSupabaseConfigured
                ? 'Connected to Live Supabase Project'
                : 'Supabase Project Credentials Required'}
            </div>
            <p className="text-[11px] opacity-85 leading-relaxed">
              {isSupabaseConfigured
                ? `Active real-time connection running on ${supabaseUrl}. Real meals, bookings, complaints, and Supabase auth are synchronized.`
                : 'Enter your Supabase Project URL and Anon Public Key below or define VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your environment.'}
            </p>
          </div>
        </div>

        {/* Form Inputs */}
        <form onSubmit={handleSave} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-slate-400" />
              <span>Supabase Project URL</span>
            </label>
            <input
              type="url"
              required
              placeholder="https://your-project-id.supabase.co"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-emerald-600 font-mono text-slate-800"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5 text-slate-400" />
              <span>Supabase Anon Public Key</span>
            </label>
            <input
              type="text"
              required
              placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
              value={keyInput}
              onChange={(e) => setKeyInput(e.target.value)}
              className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-emerald-600 font-mono text-slate-800"
            />
          </div>

          <div className="flex items-center gap-2 pt-2">
            <button
              type="submit"
              className="flex-1 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs py-3 px-4 rounded-xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Save & Connect Supabase</span>
            </button>

            {isSupabaseConfigured && (
              <button
                type="button"
                onClick={handleClear}
                className="px-3.5 py-3 rounded-xl border border-rose-200 text-rose-700 hover:bg-rose-50 text-xs font-bold transition cursor-pointer"
              >
                Disconnect
              </button>
            )}
          </div>
        </form>

        {/* Database Schema Setup Help */}
        <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-1.5 text-slate-600">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Database Tables: <code>supabase-schema.sql</code></span>
          </div>

          <a
            href="https://supabase.com/dashboard"
            target="_blank"
            rel="noopener noreferrer"
            className="text-emerald-700 hover:underline flex items-center gap-1 font-semibold"
          >
            <span>Open Supabase Dashboard</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

      </div>
    </div>
  );
}
