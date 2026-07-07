import React, { useEffect, useState } from "react";
import { Shield, Cpu, RefreshCw, AlertTriangle, CheckCircle } from "lucide-react";

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function Header({ activeTab, setActiveTab }: HeaderProps) {
  const [apiStatus, setApiStatus] = useState<{
    status: string;
    hasApiKey: boolean;
    loading: boolean;
  }>({
    status: "checking",
    hasApiKey: false,
    loading: true,
  });

  const checkStatus = async () => {
    setApiStatus((prev) => ({ ...prev, loading: true }));
    try {
      const res = await fetch("/api/status");
      const data = await res.json();
      setApiStatus({
        status: data.status || "online",
        hasApiKey: !!data.hasApiKey,
        loading: false,
      });
    } catch (err) {
      setApiStatus({
        status: "offline",
        hasApiKey: false,
        loading: false,
      });
    }
  };

  useEffect(() => {
    checkStatus();
  }, []);

  const tabs = [
    { id: "analyze", label: "Threat Analyzer", icon: Cpu },
    { id: "verify", label: "Communication Stamps", icon: Shield },
    { id: "sim", label: "Investor Security Quiz", icon: AlertTriangle },
    { id: "benchmarks", label: "Performance Benchmarks", icon: CheckCircle },
  ];

  return (
    <header className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="bg-indigo-600 p-2 rounded-lg flex items-center justify-center">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <div>
              <span className="font-display font-bold text-xl tracking-tight text-white flex items-center">
                Sentinal<span className="text-indigo-400">AI</span>
              </span>
              <span className="hidden sm:inline-block text-[10px] text-slate-400 block -mt-1 font-mono">
                SECURITIES MARKET GUARD
              </span>
            </div>
          </div>

          {/* API Connection Status */}
          <div className="flex items-center space-x-3">
            <button
              onClick={checkStatus}
              disabled={apiStatus.loading}
              className="p-1 text-slate-400 hover:text-white rounded-full hover:bg-slate-800 transition-colors"
              title="Refresh connection status"
              id="btn-refresh-status"
            >
              <RefreshCw className={`h-4 w-4 ${apiStatus.loading ? "animate-spin" : ""}`} />
            </button>

            <div className="flex items-center space-x-2 bg-slate-950 px-3 py-1.5 rounded-full border border-slate-800">
              <span className="relative flex h-2 w-2">
                <span
                  className={`absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping ${
                    apiStatus.status === "online" && apiStatus.hasApiKey
                      ? "bg-emerald-400"
                      : apiStatus.status === "online"
                      ? "bg-amber-400"
                      : "bg-rose-400"
                  }`}
                ></span>
                <span
                  className={`relative inline-flex rounded-full h-2 w-2 ${
                    apiStatus.status === "online" && apiStatus.hasApiKey
                      ? "bg-emerald-500"
                      : apiStatus.status === "online"
                      ? "bg-amber-500"
                      : "bg-rose-500"
                  }`}
                ></span>
              </span>
              <span className="text-xs font-mono font-medium tracking-tight text-slate-300">
                {apiStatus.loading ? (
                  "CHECKING ENGINE..."
                ) : apiStatus.status === "online" && apiStatus.hasApiKey ? (
                  <span className="text-emerald-400">GEMINI ENGINE: ACTIVE</span>
                ) : apiStatus.status === "online" ? (
                  <span className="text-amber-400">API ACTIVE (NO KEY)</span>
                ) : (
                  <span className="text-rose-400">OFFLINE</span>
                )}
              </span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 overflow-x-auto py-2 -mb-px">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`tab-${tab.id}`}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 text-sm font-medium rounded-md whitespace-nowrap transition-all duration-200 ${
                  isActive
                    ? "bg-slate-800 text-indigo-400 border-b-2 border-indigo-500"
                    : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
}
