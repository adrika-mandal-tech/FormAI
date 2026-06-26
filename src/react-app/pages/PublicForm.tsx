import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Sparkles, CheckCircle2, Loader2, AlertCircle, Zap } from "lucide-react";
import type { Form, FormField } from "@/shared/types";

const API = import.meta.env.VITE_API_URL || "";

export default function PublicForm() {
  const { id } = useParams<{ id: string }>();

  const [form, setForm] = useState<Form | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!id) return;

    const fetchForm = async () => {
      try {
        const res = await fetch(`${API}/api/forms/${id}`);
        if (!res.ok) throw new Error("Form not found");

        const data = await res.json();
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
      const res = await fetch(`${API}/api/forms/${id}/responses`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers: formData }),
      });

      if (!res.ok) throw new Error("Submit failed");

      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      alert("Submission failed. Try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleFieldChange = (fieldId: string, value: any) => {
    setFormData((prev) => ({ ...prev, [fieldId]: value }));
  };

  if (loading) return <Loading />;
  if (error || !form) return <ErrorView error={error} />;

  if (submitted) return <SuccessView setSubmitted={setSubmitted} setFormData={setFormData} />;

  return (
    <div className="min-h-screen bg-[var(--bg-dark)] text-gray-100">
      <header className="border-b border-white/10 sticky top-0 bg-black/40 backdrop-blur-xl">
        <div className="max-w-4xl mx-auto px-6 py-4 flex justify-between">
          <Link to="/" className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-white" />
            <span className="font-bold">FormAI</span>
          </Link>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-6 py-12">
        <form onSubmit={handleSubmit} className="space-y-6">
          {form.fields.map((field) => (
            <div key={field.id}>
              <label className="block text-sm mb-2">{field.label}</label>

              <FormFieldInput
                field={field}
                value={formData[field.id] ?? ""}
                onChange={(val) => handleFieldChange(field.id, val)}
              />
            </div>
          ))}

          <button
            disabled={submitting}
            className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl"
          >
            {submitting ? "Submitting..." : "Submit"}
          </button>
        </form>
      </div>
    </div>
  );
}

function FormFieldInput({ field, value, onChange }: any) {
  const base = "w-full px-4 py-3 bg-black border border-white/10 rounded-xl";

  if (field.type === "textarea") {
    return <textarea className={base} value={value} onChange={(e) => onChange(e.target.value)} />;
  }

  if (field.type === "checkbox") {
    return <input type="checkbox" checked={!!value} onChange={(e) => onChange(e.target.checked)} />;
  }

  return <input className={base} value={value} onChange={(e) => onChange(e.target.value)} />;
}

function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="animate-spin w-10 h-10" />
    </div>
  );
}

function ErrorView({ error }: any) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <AlertCircle className="w-10 h-10" />
      <p>{error}</p>
    </div>
  );
}

function SuccessView({ setSubmitted, setFormData }: any) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <CheckCircle2 />
      <button onClick={() => { setSubmitted(false); setFormData({}); }}>
        Submit Another
      </button>
    </div>
  );
}