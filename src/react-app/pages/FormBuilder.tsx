import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import {
  Sparkles,
  Plus,
  GripVertical,
  Trash2,
  Type,
  Loader2,
  Check,
  Eye,
  BarChart3,
  LayoutTemplate,
  Wand2,
  Save,
  ListPlus
} from "lucide-react";
import type { FormField } from "@/shared/types";



export default function FormBuilder() {
  const [isDarkMode, setIsDarkMode] = useState(true);
  
  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.body.classList.toggle('light-mode');
  };

  const [formTitle, setFormTitle] = useState("Untitled Form");
  const [formDescription, setFormDescription] = useState("");
  const [fields, setFields] = useState<FormField[]>([
    {
      id: "1",
      type: "text",
      label: "Full Name",
      placeholder: "Enter your name",
      required: true
    },
    {
      id: "2",
      type: "email",
      label: "Email Address",
      placeholder: "you@example.com",
      required: true
    }
  ]);
  const [activeFieldId, setActiveFieldId] = useState<string | null>(null);
  const [aiPrompt, setAiPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  // Auto-scroll to bottom when fields are added
  const fieldsEndRef = useRef<HTMLDivElement>(null);
  const scrollToBottom = () => {
    fieldsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const addField = () => {
    const newField: FormField = {
      id: Date.now().toString(),
      type: "text",
      label: "New Field",
      required: false,
      placeholder: "Enter value..."
    };
    setFields([...fields, newField]);
    setActiveFieldId(newField.id);
    setTimeout(scrollToBottom, 50);
  };

  const updateField = (id: string, updates: Partial<FormField>) => {
    setFields(fields.map(f => f.id === id ? { ...f, ...updates } : f));
  };

  const deleteField = (id: string) => {
    setFields(fields.filter(f => f.id !== id));
    if (activeFieldId === id) setActiveFieldId(null);
  };

  const generateForm = async () => {
    if (!aiPrompt.trim()) return;

    setIsGenerating(true);
    try {
      const response = await fetch("/api/generate-form", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: aiPrompt })
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMessage = data.error || "Failed to generate form";
        if (response.status === 503) {
          alert("The AI service is currently unavailable. Please try again in a moment.");
        } else if (response.status === 500) {
          alert(`Error: ${errorMessage}`);
        } else {
          alert("Failed to generate form. Please try again.");
        }
        return;
      }

      setFormTitle(data.title);
      setFormDescription(data.description);
      setFields(data.fields);
      setAiPrompt("");
    } catch (error) {
      console.error("Error generating form:", error);
      alert("Network error. Please check your connection and try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const saveForm = async () => {
    if (fields.length === 0) {
      alert("Please add at least one field before sharing");
      return;
    }

    setIsSaving(true);
    try {
      const response = await fetch("/api/forms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: formTitle,
          description: formDescription,
          fields
        })
      });

      if (!response.ok) {
        throw new Error("Failed to save form");
      }

      const data = await response.json();
      window.open(`/form/${data.id}`, '_blank');
    } catch (error) {
      console.error("Error saving form:", error);
      alert("Failed to save form. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen text-white font-sans overflow-x-hidden shimmer">
      
      {/* Form AI Title - Top Center */}
      <div className="form-ai-title">Form AI</div>

      {/* Peachy Background Gradients */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Moving Stars */}
        <div className="star star-1"></div>
        <div className="star star-2"></div>
        <div className="star star-3"></div>
        <div className="star star-4"></div>
        <div className="star star-5"></div>
        <div className="star star-6"></div>
        <div className="star star-7"></div>
        <div className="star star-8"></div>
        
        <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-gradient-to-br from-[var(--gradient-peach)]/20 via-[var(--gradient-mid)]/20 to-[var(--gradient-start)]/20 rounded-full blur-[200px] animate-pulse-slow mix-blend-screen" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-gradient-to-br from-[var(--gradient-end)]/20 via-[var(--gradient-accent)]/20 to-[var(--gradient-peach)]/20 rounded-full blur-[180px] animate-pulse-slow delay-1000 mix-blend-screen" />
        
        {/* Floating peach sparkles */}
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-[var(--gradient-peach)] rounded-full animate-sparkle delay-0" />
        <div className="absolute top-1/3 right-1/3 w-3 h-3 bg-[var(--gradient-mid)] rounded-full animate-sparkle delay-500" />
        <div className="absolute bottom-1/3 left-1/3 w-2 h-2 bg-[var(--gradient-start)] rounded-full animate-sparkle delay-1000" />
        
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10 pointer-events-none mix-blend-overlay"></div>
      </div>

      {/* Header */}
      <header className="border-b border-white/5 bg-[var(--bg-dark)]/80 backdrop-blur-xl sticky top-0 z-40 supports-[backdrop-filter]:bg-[var(--bg-dark)]/50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-9 h-9 bg-gradient-to-br from-[var(--gradient-mid)] to-[var(--gradient-end)] rounded-lg flex items-center justify-center shadow-lg shadow-[var(--gradient-mid)]/20 group-hover:scale-105 transition-transform">
                <LayoutTemplate className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent magical-bg neon-text animate-gradient-x">
                FormAI
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="theme-toggle-btn"
            >
              {isDarkMode ? '🌙' : '☀️'} {isDarkMode ? 'Dark' : 'Light'}
            </button>
            <Link
              to="/results"
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-all"
            >
              <BarChart3 className="w-4 h-4" />
              View Results
            </Link>
            <button
              onClick={() => setShowPreview(!showPreview)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${showPreview
                ? "bg-white text-black shadow-lg"
                : "bg-white/5 text-white hover:bg-white/10"
                }`}
            >
              <Eye className="w-4 h-4" />
              {showPreview ? "Edit Form" : "Preview"}
            </button>
            <button
              onClick={saveForm}
              disabled={isSaving}
              className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-[var(--gradient-mid)] to-[var(--gradient-end)] text-white rounded-lg text-sm font-semibold hover:shadow-[0_0_20px_-5px_var(--gradient-mid)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              {isSaving ? "Saving..." : "Save & Share"}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 relative z-10">
        {/* AI Generation Section */}
        {!showPreview && (
          <div className="mb-12 animate-fade-in-up">
            <div className="bg-gradient-to-br from-[var(--gradient-start)]/10 via-[var(--gradient-mid)]/10 to-[var(--gradient-end)]/10 rounded-2xl p-8 border border-white/5 relative overflow-hidden group hover:border-[var(--gradient-mid)]/20 transition-colors">
              <div className="absolute inset-0 bg-gradient-to-r from-[var(--gradient-start)]/5 via-[var(--gradient-mid)]/5 to-[var(--gradient-end)]/5 opacity-0 group-hover:opacity-100 transition-opacity" />

              <div className="relative z-10 max-w-2xl mx-auto text-center space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-[var(--gradient-start)] mb-2">
                  <Sparkles className="w-3 h-3" />
                  AI-Powered
                </div>

                <h2 className="text-3xl font-bold text-white">
                  Generate with <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--gradient-start)] to-[var(--gradient-mid)]">Gemini AI</span>
                </h2>

                <p className="text-gray-400 text-lg">
                  Describe what you need, and we'll build the perfect form structure for you.
                </p>

                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-[var(--gradient-start)] via-[var(--gradient-mid)] to-[var(--gradient-end)] rounded-xl opacity-20 group-hover:opacity-40 blur transition-all duration-500"></div>
                  <div className="relative flex gap-2 p-2 bg-[#0A0A0B] rounded-xl border border-white/10 shadow-2xl">
                    <input
                      type="text"
                      value={aiPrompt}
                      onChange={(e) => setAiPrompt(e.target.value)}
                      placeholder="e.g., 'Registration form for a tech conference with name, email, dietary restrictions...'"
                      className="flex-1 bg-transparent border-none text-white placeholder-gray-500 focus:ring-0 px-4 py-2 text-base"
                      onKeyDown={(e) => e.key === "Enter" && generateForm()}
                    />
                    <button
                      onClick={generateForm}
                      disabled={isGenerating || !aiPrompt.trim()}
                      className="px-6 py-2 bg-gradient-to-r from-[var(--gradient-mid)] to-[var(--gradient-end)] text-white rounded-lg font-medium hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 whitespace-nowrap"
                    >
                      {isGenerating ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Wand2 className="w-4 h-4" />
                          Generate
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {showPreview ? (
          <div className="max-w-2xl mx-auto animate-fade-in-up">
            <div className="bg-[#121214] rounded-2xl shadow-2xl border border-white/5 overflow-hidden">
              <div className="p-8 border-b border-white/5 bg-[#161618]">
                <h1 className="text-3xl font-bold text-white mb-2">{formTitle}</h1>
                {formDescription && (
                  <p className="text-gray-400 text-lg">{formDescription}</p>
                )}
              </div>
              <div className="p-8 space-y-6">
                {fields.map(field => (
                  <div key={field.id}>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      {field.label}
                      {field.required && <span className="text-[var(--gradient-mid)] ml-1">*</span>}
                    </label>
                    <input
                      disabled
                      placeholder={field.placeholder}
                      className="w-full px-4 py-3 bg-[#0A0A0B] border border-white/10 rounded-xl text-gray-400 cursor-not-allowed"
                    />
                  </div>
                ))}
                <div className="pt-4">
                  <button disabled className="w-full px-6 py-4 bg-white/10 text-white/50 rounded-xl font-semibold cursor-not-allowed">
                    Submit Response
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Form Structure */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-[#121214] rounded-2xl p-8 border border-white/5 shadow-xl">
                <input
                  type="text"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full bg-transparent text-3xl font-bold text-white placeholder-gray-600 border-none focus:ring-0 p-0 mb-4"
                  placeholder="Form Title"
                />
                <textarea
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="w-full bg-transparent text-gray-400 text-lg placeholder-gray-600 border-none focus:ring-0 p-0 resize-none"
                  placeholder="Form description (optional)"
                  rows={2}
                />
              </div>

              <div className="space-y-4">
                {fields.map((field) => (
                  <div
                    key={field.id}
                    className="group bg-[#121214] rounded-xl p-6 border border-white/5 hover:border-[var(--gradient-mid)]/30 transition-all hover:shadow-lg relative"
                  >
                    <div className="absolute right-4 top-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => deleteField(field.id)}
                        className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                        title="Delete field"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-start gap-4">
                        <div className="pt-3">
                          <GripVertical className="w-5 h-5 text-gray-600 cursor-move" />
                        </div>
                        <div className="flex-1 space-y-4">
                          <input
                            type="text"
                            value={field.label}
                            onChange={(e) => updateField(field.id, { label: e.target.value })}
                            className="block w-full bg-transparent text-lg font-medium text-white placeholder-gray-600 border-none focus:ring-0 p-0"
                            placeholder="Field Label"
                          />
                          <input
                            type="text"
                            value={field.placeholder}
                            onChange={(e) => updateField(field.id, { placeholder: e.target.value })}
                            className="block w-full bg-[var(--bg-dark)] rounded-lg border-white/10 text-sm text-gray-300 placeholder-gray-600 focus:border-[var(--gradient-mid)] focus:ring-[var(--gradient-mid)]"
                            placeholder="Placeholder text"
                          />
                        </div>
                      </div>

                      <div className="flex items-center gap-6 pl-9">
                        <div className="flex items-center gap-2">
                          <Type className="w-4 h-4 text-gray-500" />
                          <select
                            value={field.type}
                            onChange={(e) => {
                              const validTypes = ["text", "textarea", "email", "phone", "date", "checkbox", "radio", "select"];
                              if (validTypes.includes(e.target.value)) {
                                updateField(field.id, { type: e.target.value as FormField['type'] });
                              }
                            }}
                            className="bg-transparent text-sm text-gray-400 focus:text-white border-none focus:ring-0 p-0 cursor-pointer"
                          >
                            <option value="text">Text Input</option>
                            <option value="textarea">Long Text</option>
                            <option value="email">Email</option>
                            <option value="phone">Phone</option>
                            <option value="date">Date</option>
                            <option value="checkbox">Checkbox</option>
                            <option value="radio">Radio Group</option>
                            <option value="select">Dropdown</option>
                          </select>
                        </div>

                        <label className="flex items-center gap-2 cursor-pointer group/check">
                          <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${field.required ? 'bg-[var(--gradient-mid)] border-[var(--gradient-mid)]' : 'border-gray-600 group-hover/check:border-gray-500'}`}>
                            {field.required && <Check className="w-3 h-3 text-white" />}
                          </div>
                          <input
                            type="checkbox"
                            checked={field.required}
                            onChange={(e) => updateField(field.id, { required: e.target.checked })}
                            className="hidden"
                          />
                          <span className="text-sm text-gray-400 group-hover/check:text-gray-300 transition-colors">Required</span>
                        </label>

                        {(field.type === 'radio' || field.type === 'select') && (
                          <div className="flex items-center gap-2">
                            <ListPlus className="w-4 h-4 text-gray-500" />
                            <input
                              type="text"
                              value={field.options?.join(', ')}
                              onChange={(e) => updateField(field.id, { options: e.target.value.split(',').map(s => s.trim()) })}
                              placeholder="Options (comma separated)"
                              className="bg-transparent text-sm text-gray-400 focus:text-white border-b border-gray-700 focus:border-[var(--gradient-mid)] focus:ring-0 px-0 py-0.5 w-64"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                <button
                  onClick={addField}
                  className="w-full py-4 border-2 border-dashed border-white/10 rounded-xl text-gray-400 hover:text-white hover:border-[var(--gradient-mid)]/50 hover:bg-white/5 transition-all flex items-center justify-center gap-2 group"
                >
                  <Plus className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  Add Field
                </button>
              </div>
            </div>

            {/* Sidebar (Could be utilized for properties, currently empty/hidden on mobile) */}
            <div className="hidden lg:block space-y-6">
              <div className="bg-[#121214] rounded-2xl p-6 border border-white/5 sticky top-24">
                <h3 className="text-lg font-bold text-white mb-4">Tips</h3>
                <ul className="space-y-3 text-sm text-gray-400">
                  <li className="flex gap-2">
                    <span className="text-[var(--gradient-mid)]">•</span>
                    Use clear labels for better completion rates.
                  </li>
                  <li className="flex gap-2">
                    <span className="text-[var(--gradient-mid)]">•</span>
                    Group related fields together.
                  </li>
                  <li className="flex gap-2">
                    <span className="text-[var(--gradient-mid)]">•</span>
                    Keep forms as short as possible.
                  </li>
                </ul>
              </div>
            </div>
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
