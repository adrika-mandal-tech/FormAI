import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Loader2, FileText, Calendar, MessageSquare, BarChart3 } from "lucide-react";
import type { FormField } from "@/shared/types";

interface Form {
  id: string;
  title: string;
  description?: string;
  fields: FormField[];
  created_at: string;
}

interface Response {
  id: string;
  form_id: string;
  answers: Record<string, unknown>;
  submitted_at: string;
}

export default function AllResponses() {
  const [forms, setForms] = useState<Form[]>([]);
  const [allResponses, setAllResponses] = useState<Record<string, Response[]>>({});
  const [selectedFormId, setSelectedFormId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(true);
  
  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.body.classList.toggle('light-mode');
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      // Fetch all forms
      const formsResponse = await fetch('/api/forms');
      if (!formsResponse.ok) {
        throw new Error('Failed to fetch forms');
      }
      const formsData = (await formsResponse.json()) as Form[];
      setForms(formsData);

      // Fetch responses for each form
      const responsesData: Record<string, Response[]> = {};
      for (const form of formsData) {
        try {
          const responseRes = await fetch(`/api/forms/${form.id}/responses`);
          if (responseRes.ok) {
            const formResponses = (await responseRes.json()) as Response[];
            responsesData[form.id] = formResponses;
          }
        } catch (err) {
          console.error(`Failed to fetch responses for form ${form.id}:`, err);
          responsesData[form.id] = [];
        }
      }
      
      setAllResponses(responsesData);
      setError(null);
      
      // Auto-select first form if available
      if (formsData.length > 0) {
        setSelectedFormId(formsData[0].id);
      }
    } catch (err) {
      console.error('Error fetching data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const selectedForm = forms.find(f => f.id === selectedFormId);
  const selectedResponses = selectedFormId ? allResponses[selectedFormId] || [] : [];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-400 via-pink-500 to-rose-400 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-white animate-spin mx-auto mb-4" />
          <p className="text-white text-lg">Loading magical responses...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-400 via-pink-500 to-rose-400 flex items-center justify-center">
        <div className="text-center p-8">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 max-w-md">
            <h2 className="text-2xl font-bold text-white mb-4">❌ Error Loading Data</h2>
            <p className="text-white/80 mb-6">{error}</p>
            <button 
              onClick={fetchAllData}
              className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
            >
              Refresh Page
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white font-sans overflow-x-hidden">
      
      {/* Form AI Title - Top Center */}
      <div className="form-ai-title">Form AI</div>

      {/* Header */}
      <header className="text-center py-12 relative">
        <button
          onClick={toggleTheme}
          className="theme-toggle-btn absolute top-8 right-8"
        >
          {isDarkMode ? '🌙' : '☀️'} {isDarkMode ? 'Dark' : 'Light'}
        </button>
        <h1 className="text-4xl font-bold text-white mb-4">📊 Form Responses</h1>
        <p className="text-white/80 text-lg">View all responses to your AI-generated magical forms</p>
      </header>

      {/* Navigation */}
      <nav className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex justify-center gap-6 flex-wrap">
          <Link 
            to="/" 
            className="px-6 py-3 bg-white/20 backdrop-blur-lg border border-white/30 rounded-lg text-white font-medium hover:bg-white/30 transition-all"
          >
            🏠 Home
          </Link>
          <Link 
            to="/builder" 
            className="px-6 py-3 bg-white/20 backdrop-blur-lg border border-white/30 rounded-lg text-white font-medium hover:bg-white/30 transition-all"
          >
            ✏️ Create Form
          </Link>
          <Link 
            to="/created" 
            className="px-6 py-3 bg-white/20 backdrop-blur-lg border border-white/30 rounded-lg text-white font-medium hover:bg-white/30 transition-all"
          >
            📝 Created Forms
          </Link>
          <Link 
            to="/responses" 
            className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 border border-purple-500/30 rounded-lg text-white font-medium hover:shadow-lg transition-all"
          >
            📊 Responses
          </Link>
        </div>
      </nav>

      {/* Form Selector */}
      <div className="max-w-7xl mx-auto px-6 mb-8">
        {forms.length === 0 ? (
          <div className="text-center py-20">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-12 max-w-md mx-auto">
              <FileText className="w-16 h-16 text-white/60 mx-auto mb-6" />
              <h2 className="text-2xl font-bold text-white mb-4">📝 No Forms Created Yet</h2>
              <p className="text-white/80 mb-8">Start creating magical forms with AI to see their responses here!</p>
              <Link 
                to="/builder" 
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-bold text-lg hover:shadow-xl transition-all"
              >
                <span>Create Your First Form</span>
              </Link>
            </div>
          </div>
        ) : (
          <div className="flex justify-center gap-4 flex-wrap">
            {forms.map((form) => (
              <button
                key={form.id}
                onClick={() => setSelectedFormId(form.id)}
                className={`px-6 py-3 rounded-lg font-medium transition-all ${
                  selectedFormId === form.id
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                    : 'bg-white/20 backdrop-blur-lg border border-white/30 text-white hover:bg-white/30'
                }`}
              >
                {form.title}
                {allResponses[form.id]?.length > 0 && (
                  <span className="ml-2 bg-white/30 px-2 py-1 rounded-full text-xs">
                    {allResponses[form.id].length}
                  </span>
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Responses Display */}
      <main className="max-w-7xl mx-auto px-6 pb-12">
        {selectedForm && (
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">{selectedForm.title}</h2>
                <div className="flex items-center gap-4 text-white/80">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4" />
                    <span>{selectedResponses.length} responses</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>Created {new Date(selectedForm.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
              <Link 
                to={`/results/${selectedForm.id}`}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-medium hover:shadow-lg transition-all"
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                View Analytics
              </Link>
            </div>

            {selectedResponses.length === 0 ? (
              <div className="text-center py-20">
                <div className="bg-white/5 rounded-2xl p-12 max-w-md mx-auto border-2 border-dashed border-white/20">
                  <MessageSquare className="w-16 h-16 text-white/60 mx-auto mb-6" />
                  <h3 className="text-xl font-bold text-white mb-4">📝 No Responses Yet</h3>
                  <p className="text-white/80 mb-8">This form hasn't received any magical responses yet. Share it to start collecting data!</p>
                  <a 
                    href={`/form/${selectedForm.id}`} 
                    target="_blank"
                    className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-bold text-lg hover:shadow-xl transition-all"
                  >
                    <span>View Form</span>
                  </a>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {selectedResponses.map((response, index) => (
                  <div 
                    key={response.id}
                    className="bg-white/5 backdrop-blur-md border border-white/20 rounded-xl p-6 hover:bg-white/10 hover:border-white/40 transition-all hover:scale-105 group"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500"></div>
                        <span className="text-white font-medium">Response #{index + 1}</span>
                      </div>
                      <div className="text-white/60 text-sm">
                        {new Date(response.submitted_at).toLocaleDateString()}
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      {Object.entries(response.answers).map(([fieldId, answer]) => {
                        const field = selectedForm.fields.find((f: FormField) => f.id === fieldId);
                        if (!field) return null;
                        
                        return (
                          <div key={fieldId} className="bg-black/20 rounded-lg p-3">
                            <div className="text-white/70 text-xs font-medium mb-1">{field.label}</div>
                            <div className="text-white text-sm break-words">{String(answer)}</div>
                          </div>
                        );
                      })}
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between">
                      <div className="text-white/50 text-xs">ID: {response.id.slice(0, 8)}...</div>
                      <button 
                        onClick={() => window.open(`/results/${selectedForm.id}?response=${response.id}`, '_blank')}
                        className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg text-sm font-medium hover:shadow-lg transition-all"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

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
