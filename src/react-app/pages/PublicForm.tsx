import { useState, useEffect } from "react";
import { useParams, Link } from "react-router";
import { Sparkles, CheckCircle2, Loader2, AlertCircle, Zap } from "lucide-react";
import type { Form, FormField } from "@/shared/types";

export default function PublicForm() {
  const { id } = useParams<{ id: string }>();
  const [form, setForm] = useState<Form | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState<Record<string, unknown>>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!id) return;

    const fetchForm = async () => {
      try {
        const response = await fetch(`/api/forms/${id}`);
        if (!response.ok) {
          throw new Error("Form not found");
        }
        const data = await response.json();
        setForm(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load form");
      } finally {
        setLoading(false);
      }
    };

    fetchForm();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const response = await fetch(`/api/forms/${id}/responses`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ answers: formData }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit form");
      }

      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error("Submission error:", err);
      // In a real app, we'd show a proper error message
      alert("Failed to submit form. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleFieldChange = (fieldId: string, value: unknown) => {
    setFormData(prev => ({ ...prev, [fieldId]: value }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--bg-dark)] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-[var(--gradient-peach)] animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading magical form...</p>
        </div>
      </div>
    );
  }

  if (error || !form) {
    return (
      <div className="min-h-screen bg-[var(--bg-dark)] flex items-center justify-center p-4">
        <div className="glass-effect border border-[var(--gradient-end)]/20 rounded-2xl p-8 shadow-2xl max-w-md w-full text-center">
          <AlertCircle className="w-16 h-16 text-[var(--gradient-end)] mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-white mb-2">Form Not Found</h2>
          <p className="text-gray-400 mb-8">
            {error || "The form you're looking for doesn't exist or has been removed."}
          </p>
          <Link
            to="/"
            className="inline-block w-full px-6 py-3 bg-gradient-to-r from-[var(--gradient-peach)] to-[var(--gradient-mid)] text-white rounded-xl font-semibold hover:shadow-lg transition-all"
          >
            Create Your Own Form
          </Link>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-[var(--bg-dark)] flex items-center justify-center p-4">
        <div className="glass-effect border border-[var(--gradient-peach)]/20 rounded-2xl p-8 shadow-2xl max-w-md w-full text-center animate-scale-up">
          <div className="w-20 h-20 bg-[var(--gradient-peach)]/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-[var(--gradient-peach)]" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">� Thank You!</h2>
          <p className="text-gray-400 mb-8">
            Your magical response has been submitted successfully.
          </p>
          <button
            onClick={() => {
              setSubmitted(false);
              setFormData({});
            }}
            className="block w-full px-6 py-4 bg-gradient-to-r from-[var(--gradient-peach)] to-[var(--gradient-mid)] text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-[var(--gradient-peach)]/20 transition-all"
          >
            � Submit Another Response
          </button>

          <div className="mt-8 pt-6 border-t border-white/5">
            <Link to="/" className="text-sm text-gray-500 hover:text-white transition-colors flex items-center justify-center gap-2">
              <Zap className="w-3 h-3" />
              Powered by FormAI
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-dark)] text-gray-100 font-sans selection:bg-[var(--gradient-mid)]/30">
      {/* Peachy Background Gradients */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] right-[-10%] w-[70%] h-[70%] bg-gradient-to-br from-[var(--gradient-peach)]/20 via-[var(--gradient-mid)]/20 to-[var(--gradient-start)]/20 rounded-full blur-[200px] animate-pulse-slow mix-blend-screen" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[60%] h-[60%] bg-gradient-to-br from-[var(--gradient-end)]/20 via-[var(--gradient-accent)]/20 to-[var(--gradient-peach)]/20 rounded-full blur-[180px] animate-pulse-slow delay-1000 mix-blend-screen" />
        
        {/* Floating peach sparkles */}
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-[var(--gradient-peach)] rounded-full animate-sparkle delay-0" />
        <div className="absolute top-1/3 right-1/3 w-3 h-3 bg-[var(--gradient-mid)] rounded-full animate-sparkle delay-500" />
        <div className="absolute bottom-1/3 left-1/3 w-2 h-2 bg-[var(--gradient-start)] rounded-full animate-sparkle delay-1000" />
        
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10 pointer-events-none mix-blend-overlay"></div>
      </div>

      {/* Header */}
      <header className="border-b border-white/10 glass-effect backdrop-blur-xl sticky top-0 z-40 supports-[backdrop-filter]:glass-effect">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-gradient-to-br from-[var(--gradient-peach)] to-[var(--gradient-mid)] rounded-lg flex items-center justify-center shadow-lg shadow-[var(--gradient-peach)]/20">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold text-white group-hover:text-[var(--gradient-peach)] transition-colors">
              � FormAI
            </span>
          </Link>
          <Link
            to="/builder"
            className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors font-medium border border-transparent hover:border-[var(--gradient-peach)]/30 rounded-lg"
          >
            Create Your Own
          </Link>
        </div>
      </header>

      {/* Form */}
      <div className="max-w-2xl mx-auto px-6 py-12 relative z-10">
        <div className="glass-effect border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
          {/* Form Header */}
          <div className="p-8 border-b border-white/5 bg-[var(--bg-medium)] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[var(--gradient-peach)]/10 via-[var(--gradient-mid)]/10 to-[var(--gradient-start)]/10 rounded-full blur-[80px] pointer-events-none" />
            <h1 className="text-3xl font-bold text-white mb-3 relative z-10">{form.title}</h1>
            {form.description && (
              <p className="text-gray-400 text-lg leading-relaxed relative z-10">{form.description}</p>
            )}
          </div>

          {/* Form Fields */}
          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            {form.fields.map(field => (
              <div key={field.id} className="animate-fade-in-up">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  {field.label}
                  {field.required && <span className="text-[var(--gradient-mid)] ml-1">*</span>}
                </label>
                <FormFieldInput
                  field={field}
                  value={formData[field.id]}
                  onChange={(value) => handleFieldChange(field.id, value)}
                />
              </div>
            ))}

            <div className="pt-4">
              <button
                type="submit"
                disabled={submitting}
                className="w-full px-8 py-4 bg-gradient-to-r from-[var(--gradient-peach)] to-[var(--gradient-mid)] text-white rounded-xl font-bold text-lg hover:shadow-[0_0_30px_-10px_var(--gradient-peach)] disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-3"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Submit Response"
                )}
              </button>
            </div>
          </form>
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
    </div>
  );
}

function FormFieldInput({
  field,
  value,
  onChange
}: {
  field: FormField;
  value: unknown;
  onChange: (value: unknown) => void;
}) {
  const baseInputClass = "w-full px-4 py-3 bg-[#0A0A0B] border border-white/10 rounded-xl text-white placeholder-gray-600 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition-all";

  switch (field.type) {
    case "textarea":
      return (
        <textarea
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder}
          required={field.required}
          rows={4}
          className={baseInputClass}
        />
      );
    case "checkbox":
      return (
        <div className="flex items-center gap-3 p-3 rounded-xl border border-white/5 hover:border-white/10 transition-colors bg-[#0A0A0B]">
          <input
            type="checkbox"
            checked={value || false}
            onChange={(e) => onChange(e.target.checked)}
            required={field.required}
            className="w-5 h-5 rounded border-gray-600 bg-transparent text-purple-500 focus:ring-offset-0 focus:ring-purple-500"
          />
          <label className="text-gray-300 cursor-pointer">{field.placeholder || "I agree"}</label>
        </div>
      );
    case "radio":
      return (
        <div className="space-y-3">
          {field.options?.map((option, index) => (
            <div key={index} className="flex items-center gap-3 p-3 rounded-xl border border-white/5 hover:border-white/10 transition-colors bg-[#0A0A0B]">
              <input
                type="radio"
                name={field.id}
                value={option}
                checked={value === option}
                onChange={(e) => onChange(e.target.value)}
                required={field.required}
                className="w-5 h-5 border-gray-600 bg-transparent text-purple-500 focus:ring-offset-0 focus:ring-purple-500"
              />
              <label className="text-gray-300 cursor-pointer w-full">{option}</label>
            </div>
          ))}
        </div>
      );
    case "select":
      return (
        <div className="relative">
          <select
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            required={field.required}
            className={`${baseInputClass} appearance-none`}
          >
            <option value="" className="bg-[#0A0A0B]">Select an option</option>
            {field.options?.map((option, index) => (
              <option key={index} value={option} className="bg-[#0A0A0B]">
                {option}
              </option>
            ))}
          </select>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
          </div>
        </div>
      );
    case "phone":
      return (
        <input
          type="tel"
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder}
          required={field.required}
          className={baseInputClass}
        />
      );
    default:
      return (
        <input
          type={field.type}
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder}
          required={field.required}
          className={baseInputClass}
        />
      );
  }
}
