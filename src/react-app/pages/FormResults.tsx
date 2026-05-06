import { useState, useEffect } from "react";
import { useParams, Link } from "react-router";
import { Loader2, AlertCircle, ArrowLeft } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import type { Form, FormResponse } from "@/shared/types";

const COLORS = ['#00ff88', '#ff00ff', '#00ccff', '#ffaa00', '#ff3366', '#9945ff', '#ffcc99', '#ff9966'];

export default function FormResults() {
    const { id } = useParams<{ id: string }>();
    const [form, setForm] = useState<Form | null>(null);
    const [responses, setResponses] = useState<FormResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isDarkMode, setIsDarkMode] = useState(true);
    
    const toggleTheme = () => {
        setIsDarkMode(!isDarkMode);
        document.body.classList.toggle('light-mode');
    };
    
    useEffect(() => {
        // Add responses-page class to body
        document.body.classList.add('responses-page');
        return () => {
            document.body.classList.remove('responses-page');
        };
    }, []);

    useEffect(() => {
        if (!id) return;

        const fetchData = async () => {
            try {
                const [formRes, responsesRes] = await Promise.all([
                    fetch(`/api/forms/${id}`),
                    fetch(`/api/forms/${id}/responses`)
                ]);

                if (!formRes.ok) throw new Error("Failed to load form");
                if (!responsesRes.ok) throw new Error("Failed to load responses");

                const formData = await formRes.json();
                const responsesData = await responsesRes.json();

                setForm(formData);
                setResponses(responsesData);
            } catch (err) {
                setError(err instanceof Error ? err.message : "Failed to load data");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-[var(--bg-dark)] flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 text-[var(--gradient-mid)] animate-spin mx-auto mb-4" />
                    <p className="text-gray-400">Loading magical results...</p>
                </div>
            </div>
        );
    }

    if (error || !form) {
        return (
            <div className="min-h-screen bg-[var(--bg-dark)] flex items-center justify-center p-4">
                <div className="glass-effect border border-[var(--gradient-end)]/20 rounded-2xl p-8 shadow-2xl max-w-md w-full text-center">
                    <AlertCircle className="w-16 h-16 text-[var(--gradient-end)] mx-auto mb-6" />
                    <h2 className="text-2xl font-bold text-white mb-2">Error Loading Results</h2>
                    <p className="text-gray-400 mb-8">{error || "Form not found"}</p>
                    <Link to="/" className="inline-block w-full px-6 py-3 bg-gradient-to-r from-[var(--gradient-start)] to-[var(--gradient-mid)] text-white rounded-xl font-semibold hover:shadow-lg transition-all">
                        Go Home
                    </Link>
                </div>
            </div>
        );
    }

    // Helper to process data for charts
    const getChartData = (fieldId: string) => {
        const counts: Record<string, number> = {};
        responses.forEach(r => {
            const answer = r.answers[fieldId];
            if (answer) {
                counts[answer] = (counts[answer] || 0) + 1;
            }
        });
        return Object.entries(counts).map(([name, value]) => ({ name, value }));
    };

    return (
        <div className="min-h-screen text-white font-sans overflow-x-hidden">
            
            {/* Form AI Title - Top Center */}
            <div className="form-ai-title">Form AI</div>

            {/* Magical Background Effects */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-gradient-to-br from-[var(--gradient-start)]/20 via-[var(--gradient-mid)]/20 to-[var(--gradient-end)]/20 rounded-full blur-[200px] animate-pulse-slow mix-blend-screen" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-gradient-to-br from-[var(--gradient-end)]/20 via-[var(--gradient-accent)]/20 to-[var(--gradient-pink)]/20 rounded-full blur-[180px] animate-pulse-slow delay-1000 mix-blend-screen" />
                
                {/* Floating sparkles */}
                <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-[var(--gradient-start)] rounded-full animate-sparkle delay-0" />
                <div className="absolute top-1/3 right-1/3 w-3 h-3 bg-[var(--gradient-mid)] rounded-full animate-sparkle delay-500" />
                <div className="absolute bottom-1/3 left-1/3 w-2 h-2 bg-[var(--gradient-end)] rounded-full animate-sparkle delay-1000" />
                
                <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10 pointer-events-none mix-blend-overlay"></div>
            </div>

            {/* Header */}
            <header className="border-b border-white/10 glass-effect backdrop-blur-xl sticky top-0 z-40 supports-[backdrop-filter]:glass-effect">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link to="/builder" className="p-2 hover:bg-white/10 rounded-lg transition-colors text-gray-400 hover:text-white group">
                            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                        </Link>
                        <div>
                            <h1 className="text-xl font-bold text-white neon-text">{form.title}</h1>
                            <p className="text-sm text-gray-400">✨ {responses.length} magical responses collected</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={toggleTheme}
                            className="theme-toggle-btn"
                        >
                            {isDarkMode ? '🌙' : '☀️'} {isDarkMode ? 'Dark' : 'Light'}
                        </button>
                        <div className="px-3 py-1 glass-effect border border-[var(--gradient-start)]/30 rounded-full">
                            <span className="text-xs font-medium text-[var(--gradient-start)]">Live Form</span>
                        </div>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-6 py-8 space-y-8 relative z-10">

                {/* Magical Charts Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {form.fields.filter(f => ['radio', 'select'].includes(f.type)).map(field => {
                        const data = getChartData(field.id);
                        if (data.length === 0) return null;

                        return (
                            <div key={field.id} className="glass-effect border border-white/10 rounded-2xl p-6 shadow-xl hover:border-[var(--gradient-mid)]/50 transition-all hover:scale-105">
                                <h3 className="text-lg font-semibold text-white mb-6 neon-text">📊 {field.label}</h3>
                                <div className="h-[300px] w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={data}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={60}
                                                outerRadius={80}
                                                paddingAngle={5}
                                                dataKey="value"
                                            >
                                                {data.map((_, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <Tooltip
                                                contentStyle={{ backgroundColor: 'rgba(10, 5, 21, 0.9)', borderColor: 'rgba(255,0,255,0.3)', color: '#fff', borderRadius: '12px', backdropFilter: 'blur(10px)' }}
                                                itemStyle={{ color: '#fff' }}
                                            />
                                            <Legend />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Enhanced Response Storage Section */}
                <div className="space-y-8">
                    <div className="flex items-center justify-between">
                        <h2 className="text-3xl font-bold text-white neon-text">✨ Response Storage</h2>
                        <div className="flex items-center gap-3">
                            <div className="px-4 py-2 glass-effect border border-[var(--gradient-start)]/30 rounded-full">
                                <span className="text-sm font-medium text-[var(--gradient-start)]">{responses.length} Total Responses</span>
                            </div>
                            <div className="px-4 py-2 glass-effect border border-[var(--gradient-accent)]/30 rounded-full">
                                <span className="text-sm font-medium text-[var(--gradient-accent)]">{form.fields.length} Fields</span>
                            </div>
                        </div>
                    </div>

                    {/* Summary Statistics */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="glass-effect border border-[var(--gradient-start)]/20 rounded-2xl p-6 hover:border-[var(--gradient-start)]/50 transition-all">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-400 mb-1">Total Responses</p>
                                    <p className="text-2xl font-bold text-[var(--gradient-start)]">{responses.length}</p>
                                </div>
                                <div className="w-12 h-12 bg-[var(--gradient-start)]/20 rounded-xl flex items-center justify-center">
                                    <svg className="w-6 h-6 text-[var(--gradient-start)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                        
                        <div className="glass-effect border border-[var(--gradient-mid)]/20 rounded-2xl p-6 hover:border-[var(--gradient-mid)]/50 transition-all">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-400 mb-1">Form Fields</p>
                                    <p className="text-2xl font-bold text-[var(--gradient-mid)]">{form.fields.length}</p>
                                </div>
                                <div className="w-12 h-12 bg-[var(--gradient-mid)]/20 rounded-xl flex items-center justify-center">
                                    <svg className="w-6 h-6 text-[var(--gradient-mid)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                        
                        <div className="glass-effect border border-[var(--gradient-end)]/20 rounded-2xl p-6 hover:border-[var(--gradient-end)]/50 transition-all">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-400 mb-1">Response Rate</p>
                                    <p className="text-2xl font-bold text-[var(--gradient-end)]">100%</p>
                                </div>
                                <div className="w-12 h-12 bg-[var(--gradient-end)]/20 rounded-xl flex items-center justify-center">
                                    <svg className="w-6 h-6 text-[var(--gradient-end)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>
                    {responses.length === 0 ? (
                        <div className="text-center py-12 text-gray-500 glass-effect border border-white/10 border-dashed rounded-2xl">
                            <div className="w-16 h-16 mx-auto mb-4 rounded-full glass-effect border border-white/10 flex items-center justify-center">
                                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                            <p className="text-gray-400 mb-2">No magical responses yet</p>
                            <p className="text-sm text-gray-500">Share your form to start collecting data! ✨</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {responses.map((response, index) => (
                                <div key={response.id} className="glass-effect border border-white/10 rounded-2xl p-6 hover:border-[var(--gradient-mid)]/50 hover:shadow-[0_0_30px_-10px_rgba(255,0,255,0.3)] transition-all hover:scale-105 group relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-[var(--gradient-start)]/20 to-[var(--gradient-mid)]/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                                    
                                    {/* Response Header */}
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-3 h-3 rounded-full bg-[var(--gradient-start)] animate-pulse neon-text"></div>
                                            <span className="text-xs font-medium text-[var(--gradient-start)]">Response #{index + 1}</span>
                                        </div>
                                        <div className="text-xs text-gray-400">
                                            {new Date(response.submitted_at).toLocaleDateString()}
                                        </div>
                                    </div>
                                    
                                    {/* Response Data */}
                                    <div className="space-y-4">
                                        {form.fields.map(field => {
                                            const answer = response.answers[field.id];
                                            if (!answer) return null;

                                            return (
                                                <div key={field.id} className="group/field">
                                                    <div className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1 flex items-center gap-2">
                                                        <div className="w-1 h-1 rounded-full bg-[var(--gradient-accent)]"></div>
                                                        {field.label}
                                                    </div>
                                                    <div className="text-sm text-gray-200 break-words p-2 bg-white/5 rounded-lg border border-white/5 hover:border-[var(--gradient-mid)]/30 transition-colors">
                                                        {field.type === 'email' ? (
                                                            <a href={`mailto:${answer}`} className="text-[var(--gradient-end)] hover:text-[var(--gradient-mid)] transition-colors flex items-center gap-1">
                                                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                                                </svg>
                                                                {answer}
                                                            </a>
                                                        ) : field.type === 'phone' ? (
                                                            <a href={`tel:${answer}`} className="text-[var(--gradient-start)] hover:text-[var(--gradient-accent)] transition-colors flex items-center gap-1">
                                                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                                                </svg>
                                                                {answer}
                                                            </a>
                                                        ) : field.type === 'date' ? (
                                                            <div className="flex items-center gap-1 text-[var(--gradient-mid)]">
                                                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                                </svg>
                                                                {answer}
                                                            </div>
                                                        ) : (
                                                            <span>{String(answer)}</span>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                    
                                    {/* Enhanced Footer */}
                                    <div className="mt-4 pt-4 border-t border-white/5">
                                        <div className="flex items-center justify-between">
                                            <div className="text-xs text-gray-500">
                                                ID: {response.id.slice(0, 8)}...
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs text-[var(--gradient-mid)]">✨</span>
                                                <span className="text-xs text-gray-400">Captured</span>
                                                <button className="text-xs text-[var(--gradient-mid)] hover:text-[var(--gradient-accent)] transition-colors">
                                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

      {/* Footer */}
      <footer className="relative border-t border-white/5 bg-[var(--bg-dark)]/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-center md:text-left">
              <p className="text-white/60 text-sm">
                Built with ❤️ by FormAI - Transforming forms with magic
              </p>
            </div>
            <div className="flex items-center gap-6">
              <a 
                href="https://www.linkedin.com/in/adrika-mandal-753226246/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 rounded-lg text-blue-300 hover:text-blue-200 hover:border-blue-500/50 transition-all group"
              >
                <svg className="w-4 h-4 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
                <span className="text-sm font-medium">LinkedIn</span>
              </a>
              <a 
                href="mailto:adrika.mandal01@gmail.com" 
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500/20 to-teal-500/20 border border-green-500/30 rounded-lg text-green-300 hover:text-green-200 hover:border-green-500/50 transition-all group"
              >
                <svg className="w-4 h-4 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span className="text-sm font-medium">Email</span>
              </a>
              <a 
                href="https://instagram.com/_adrika_mandal_" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-pink-500/20 to-purple-500/20 border border-pink-500/30 rounded-lg text-pink-300 hover:text-pink-200 hover:border-pink-500/50 transition-all group"
              >
                <svg className="w-4 h-4 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
                <span className="text-sm font-medium">Instagram</span>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
