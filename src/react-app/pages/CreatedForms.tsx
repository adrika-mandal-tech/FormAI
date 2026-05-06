import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Loader2, FileText, Calendar, Plus } from "lucide-react";
import type { FormField } from "@/shared/types";

const API = import.meta.env.VITE_API_URL || "";
const api = (p: string) => `${API}${p}`;

interface Form {
  id: string;
  title: string;
  description?: string;
  fields: FormField[];
  created_at: string;
}

export default function CreatedForms() {
  const [forms, setForms] = useState<Form[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(api("/api/forms"));
        if (!res.ok) throw new Error("Failed");

        const data = await res.json();
        setForms(Array.isArray(data) ? data : []);
      } catch {
        setError("Failed to load forms");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  if (error) {
    return <div className="min-h-screen flex items-center justify-center">{error}</div>;
  }

  return (
    <div className="min-h-screen text-white">
      <div className="form-ai-title">Form AI</div>

      <header className="text-center py-10">
        <h1 className="text-3xl font-bold">Created Forms</h1>
      </header>

      <main className="max-w-6xl mx-auto p-6">
        {forms.length === 0 ? (
          <div className="text-center opacity-70">No forms yet</div>
        ) : (
          <div className="grid md:grid-cols-3 gap-4">
            {forms.map((f) => (
              <div key={f.id} className="p-4 border border-white/10 rounded-xl">
                <h2>{f.title}</h2>
                <p className="text-sm opacity-60">{f.fields?.length ?? 0} fields</p>

                <div className="flex justify-between mt-4 text-sm">
                  <span>
                    <Calendar className="inline w-4 h-4" />{" "}
                    {new Date(f.created_at).toLocaleDateString()}
                  </span>

                  <Link to={`/results/${f.id}`}>Results</Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}