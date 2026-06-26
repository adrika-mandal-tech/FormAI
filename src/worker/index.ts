import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { GoogleGenAI } from "@google/genai";
import {
  GenerateFormRequestSchema,
  SaveFormRequestSchema,
  type GenerateFormResponse,
  type SaveFormResponse,
  type Form
} from "@/shared/types";

type Env = {
  DB: D1Database;
  GEMINI_API_KEY: string;
};

const app = new Hono<{ Bindings: Env }>();

// API Routes
// API Routes
app.post("/api/generate-form", zValidator("json", GenerateFormRequestSchema), async (c) => {
  const { prompt } = c.req.valid("json");
  const apiKey = c.env.GEMINI_API_KEY;

  if (!apiKey) {
    return c.json({ error: "Gemini API key not configured" }, 500);
  }

  try {
    const ai = new GoogleGenAI({ apiKey });

    const systemPrompt = `You are an expert form builder assistant. When given a description of a form, generate a complete, professional form structure with appropriate fields.

Return a JSON object with this exact structure:
{
  "title": "Form Title",
  "description": "Brief description",
  "fields": [
    {
      "id": "unique-id",
      "type": "text|email|phone|date|textarea|checkbox|radio|select",
      "label": "Field Label",
      "placeholder": "Optional placeholder text",
      "required": true|false,
      "options": ["Option 1", "Option 2"] // only for radio/select
    }
  ]
}

Guidelines:
- **Optimization**: Create a logical flow. Group related fields if possible (implied by order).
- **Labels**: Use clear, concise, and user-friendly labels.
- **Placeholders**: Add helpful placeholder text to guide the user.
- **Field Types**: Use specific input types (email, phone, date) where applicable.
- **Required Fields**: Mark essential fields (Name, Email, etc.) as required.
- **Options**: For Radio/Select, provide 3-5 relevant and distinct options.
- **Quantity**: Generate enough fields to make the form useful (typically 5-15 fields), but avoid overwhelming the user.
- **Description**: Write a warm, inviting description for the form header.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        responseSchema: {
          type: "object",
          properties: {
            title: { type: "string" },
            description: { type: "string" },
            fields: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  id: { type: "string" },
                  type: {
                    type: "string",
                    enum: ["text", "email", "phone", "date", "textarea", "checkbox", "radio", "select"]
                  },
                  label: { type: "string" },
                  placeholder: { type: "string" },
                  required: { type: "boolean" },
                  options: {
                    type: "array",
                    items: { type: "string" }
                  }
                },
                required: ["id", "type", "label", "required"]
              }
            }
          },
          required: ["title", "description", "fields"]
        }
      }
    });

    if (!response.text) {
      return c.json({ error: "Empty response from Gemini" }, 500);
    }
    const formData: GenerateFormResponse = JSON.parse(response.text);
    return c.json(formData);
  } catch (error) {
    console.error("Gemini API error:", error);
    
    // Check if it's a 503 Service Unavailable error
    if (error instanceof Error && error.message.includes("503")) {
      return c.json({ error: "AI service temporarily unavailable. Please try again later." }, 503);
    }
    
    const errorMessage = error instanceof Error ? error.message : "Failed to generate form";
    return c.json({ error: errorMessage }, 500);
  }
});

app.post("/api/forms", zValidator("json", SaveFormRequestSchema), async (c) => {
  const { title, description, fields } = c.req.valid("json");

  try {
    const id = crypto.randomUUID();
    const fieldsJson = JSON.stringify(fields);

    await c.env.DB.prepare(
      "INSERT INTO forms (id, title, description, fields) VALUES (?, ?, ?, ?)"
    )
      .bind(id, title, description ?? "", fieldsJson)
      .run();

    const shareUrl = `${new URL(c.req.url).origin}/form/${id}`;

    const response: SaveFormResponse = {
      id,
      shareUrl
    };

    return c.json(response);
  } catch (error) {
    console.error("Error saving form:", error);
    return c.json({ error: "Failed to save form" }, 500);
  }
});

app.get("/api/forms", async (c) => {
  try {
    const results = await c.env.DB.prepare(
      "SELECT * FROM forms ORDER BY created_at DESC"
    )
      .all();

    const forms = results.results.map((form: Record<string, unknown>) => ({
      id: form.id,
      title: form.title,
      description: form.description,
      fields: JSON.parse(form.fields as string),
      created_at: form.created_at,
      updated_at: form.updated_at
    }));

    return c.json(forms);
  } catch (error) {
    console.error("Error fetching all forms:", error);
    return c.json({ error: "Failed to fetch forms" }, 500);
  }
});

app.get("/api/forms/:id", async (c) => {
  const id = c.req.param("id");

  try {
    const result = await c.env.DB.prepare(
      "SELECT * FROM forms WHERE id = ?"
    )
      .bind(id)
      .first();

    if (!result) {
      return c.json({ error: "Form not found" }, 404);
    }

    const fieldsStr = result.fields as string;
    const form: Form = {
      id: result.id as string,
      title: result.title as string,
      description: result.description as string | undefined,
      fields: JSON.parse(fieldsStr),
      created_at: result.created_at as string,
      updated_at: result.updated_at as string
    };

    return c.json(form);
  } catch (error) {
    console.error("Error fetching form:", error);
    return c.json({ error: "Failed to fetch form" }, 500);
  }
});

// New Routes for Responses

app.post("/api/forms/:id/responses", async (c) => {
  const formId = c.req.param("id");
  const body = await c.req.json();
  console.log("Received submission:", JSON.stringify(body));

  // Basic validation that we have an answers object
  if (!body.answers || typeof body.answers !== 'object') {
    console.error("Invalid answers:", body.answers);
    return c.json({ error: "Invalid response data" }, 400);
  }

  try {
    const responseId = crypto.randomUUID();
    const answersJson = JSON.stringify(body.answers);
    const submittedAt = new Date().toISOString();

    await c.env.DB.prepare(
      "INSERT INTO form_responses (id, form_id, answers, submitted_at) VALUES (?, ?, ?, ?)"
    )
      .bind(responseId, formId, answersJson, submittedAt)
      .run();

    return c.json({ success: true, id: responseId });
  } catch (error) {
    console.error("Error saving response:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return c.json({ error: `Failed to save response: ${errorMessage}` }, 500);
  }
});

app.get("/api/forms/:id/responses", async (c) => {
  const formId = c.req.param("id");

  try {
    const results = await c.env.DB.prepare(
      "SELECT * FROM form_responses WHERE form_id = ? ORDER BY submitted_at DESC"
    )
      .bind(formId)
      .all();

    const responses = results.results.map((r: Record<string, unknown>) => ({
      id: r.id,
      form_id: r.form_id,
      answers: JSON.parse(r.answers as string),
      submitted_at: r.submitted_at
    }));

    return c.json(responses);
  } catch (error) {
    console.error("Error fetching responses:", error);
    return c.json({ error: "Failed to fetch responses" }, 500);
  }
});

// Catch-all route: serve static assets and handle client-side routing
app.get("*", async (c) => {
  // In production, let Cloudflare serve static assets
  // In development, serve the dev HTML
  if (c.env && 'ASSETS' in c.env) {
    // Production: fetch from static assets
    const assets = (c.env as { ASSETS: unknown }) as Record<string, unknown>;
    const assetsHandler = assets.ASSETS as { fetch: (req: Request) => Promise<Response> };
    const asset = await assetsHandler.fetch(c.req.raw);
    if (asset.status === 404) {
      // For 404s, serve index.html for client-side routing
      return assetsHandler.fetch(new Request(new URL('/index.html', c.req.url).toString()));
    }
    return asset;
  }

  // Development: serve dev HTML
  return c.html(`<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>FormAI</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/react-app/main.tsx"></script>
  </body>
</html>`);
});

export default app;
