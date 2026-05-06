import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Sparkles, CheckCircle2, Loader2, AlertCircle, Zap } from "lucide-react";
import type { Form, FormField } from "@/shared/types";

export default function PublicForm() {
  const { id } = useParams<{ id: string }>();
  const [form, setForm] = useState<Form | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  // ✅ FIX: unknown → any (deployment-safe)
  const [formData, setFormData] = useState<Record<string, any>>({});

  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!id) return;

    const fetchForm = async () => {
      try {
        const response = await fetch(`/api/forms/${id}`);
        if (!response.ok) throw new Error("Form not found");

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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers: formData }),
      });

      if (!response.ok) throw new Error("Failed to submit form");

      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      console.error("Submission error:", err);
      alert("Failed to submit form. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // ✅ FIX: unknown → any
  const handleFieldChange = (fieldId: string, value: any) => {
    setFormData((prev) => ({ ...prev, [fieldId]: value }));
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

          <h2 className="text-3xl font-bold text-white mb-2">Thank You!</h2>

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
            Submit Another Response
          </button>

          <div className="mt-8 pt-6 border-t border-white/5">
            <Link
              to="/"
              className="text-sm text-gray-500 hover:text-white transition-colors flex items-center justify-center gap-2"
            >
              <Zap className="w-3 h-3" />
              Powered by FormAI
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-dark)] text-gray-100 font-sans">
      <header className="border-b border-white/10 sticky top-0 z-40 bg-black/40 backdrop-blur-xl">
        <div className="max-w-4xl mx-auto px-6 py-4 flex justify-between">
          <Link to="/" className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-white" />
            <span className="text-white font-bold">FormAI</span>
          </Link>

          <Link to="/builder" className="text-gray-400 hover:text-white">
            Create Your Own
          </Link>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-6 py-12">
        <form onSubmit={handleSubmit} className="space-y-6">
          {form.fields.map((field) => (
            <div key={field.id}>
              <label className="block text-sm text-gray-300 mb-2">
                {field.label}
              </label>

              <FormFieldInput
                field={field}
                value={formData[field.id] ?? ""}   // ✅ FIX
                onChange={(value) => handleFieldChange(field.id, value)}
              />
            </div>
          ))}

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-4 bg-gradient-to-r from-[var(--gradient-peach)] to-[var(--gradient-mid)] text-white rounded-xl"
          >
            {submitting ? "Submitting..." : "Submit Response"}
          </button>
        </form>
      </div>
    </div>
  );
}

/* ---------------- FIXED COMPONENT ---------------- */

function FormFieldInput({
  field,
  value,
  onChange,
}: {
  field: FormField;
  value: any;          // ✅ FIX
  onChange: (value: any) => void;
}) {
  const base = "w-full px-4 py-3 bg-black border border-white/10 rounded-xl text-white";

  switch (field.type) {
    case "textarea":
      return (
        <textarea
          value={value ?? ""}   // ✅ FIX
          onChange={(e) => onChange(e.target.value)}
          className={base}
        />
      );

    case "checkbox":
      return (
        <input
          type="checkbox"
          checked={Boolean(value)}   // ✅ FIX
          onChange={(e) => onChange(e.target.checked)}
        />
      );

    default:
      return (
        <input
          type={field.type}
          value={value ?? ""}   // ✅ FIX
          onChange={(e) => onChange(e.target.value)}
          className={base}
        />
      );
  }
}