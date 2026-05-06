import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Loader2, AlertCircle, ArrowLeft } from "lucide-react";
import type { Form, FormResponse } from "@/shared/types";

const API = import.meta.env.VITE_API_URL || "";

const api = (p: string) => `${API}${p}`;

async function safeFetch(url: string) {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Fetch failed");
  return res.json();
}

export default function FormResults() {
  const { id } = useParams<{ id: string }>();

  const [form, setForm] = useState<Form | null>(null);
  const [responses, setResponses] = useState<FormResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    (async () => {
      try {
        const [f, r] = await Promise.all([
          safeFetch(api(`/api/forms/${id}`)),
          safeFetch(api(`/api/forms/${id}/responses`)),
        ]);

        setForm(f);
        setResponses(r || []);
      } catch (e) {
        setError("Failed to load results");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin w-8 h-8" />
      </div>
    );
  }

  if (error || !form) {
    return (
      <div className="min-h-screen flex items-center justify-center gap-3">
        <AlertCircle />
        <span>{error || "Form not found"}</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white">
      <header className="p-4 border-b border-white/10 flex items-center gap-4">
        <Link to="/builder">
          <ArrowLeft />
        </Link>
        <h1>{form.title}</h1>
      </header>

      <div className="p-6">
        {/* UI untouched */}
      </div>
    </div>
  );
}