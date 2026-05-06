import z from "zod";

/**
 * Types shared between the client and server go here.
 */

export const FieldTypeSchema = z.enum([
  "text",
  "email",
  "phone",
  "date",
  "textarea",
  "checkbox",
  "radio",
  "select"
]);

export const FormFieldSchema = z.object({
  id: z.string(),
  type: FieldTypeSchema,
  label: z.string(),
  placeholder: z.string().optional(),
  required: z.boolean(),
  options: z.array(z.string()).optional()
});

export const GenerateFormRequestSchema = z.object({
  prompt: z.string().min(1, "Prompt cannot be empty")
});

export const GenerateFormResponseSchema = z.object({
  title: z.string(),
  description: z.string(),
  fields: z.array(FormFieldSchema)
});

export const SaveFormRequestSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  fields: z.array(FormFieldSchema)
});

export const SaveFormResponseSchema = z.object({
  id: z.string(),
  shareUrl: z.string()
});

export const FormSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().optional(),
  fields: z.array(FormFieldSchema),
  created_at: z.string(),
  updated_at: z.string()
});

export type FieldType = z.infer<typeof FieldTypeSchema>;
export type FormField = z.infer<typeof FormFieldSchema>;
export type GenerateFormRequest = z.infer<typeof GenerateFormRequestSchema>;
export type GenerateFormResponse = z.infer<typeof GenerateFormResponseSchema>;
export type SaveFormRequest = z.infer<typeof SaveFormRequestSchema>;
export type SaveFormResponse = z.infer<typeof SaveFormResponseSchema>;
export type Form = z.infer<typeof FormSchema>;

export const FormResponseSchema = z.object({
  id: z.string(),
  form_id: z.string(), // Changed from formId to form_id to match database
  answers: z.record(z.unknown()), // key is fieldId, value is answer
  submitted_at: z.string() // Changed from submittedAt to submitted_at to match database
});

export type FormResponse = z.infer<typeof FormResponseSchema>;
