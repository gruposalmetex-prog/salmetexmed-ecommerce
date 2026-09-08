import { z } from "zod";

export const productDocumentTypes = [
  "technical_sheet",
  "manual",
  "certificate",
  "brochure",
] as const;

export const createAdminProductDocumentSchema =
  z.object({
    productId: z.uuid(
      "El producto no es válido",
    ),

    documentType: z.enum(
      productDocumentTypes,
      {
        error:
          "Selecciona un tipo de documento válido",
      },
    ),

    title: z
      .string()
      .trim()
      .min(
        3,
        "El título debe tener al menos 3 caracteres",
      )
      .max(
        160,
        "El título no puede superar 160 caracteres",
      ),
  });

export type ProductDocumentType =
  (typeof productDocumentTypes)[number];

export type CreateAdminProductDocumentInput =
  z.infer<
    typeof createAdminProductDocumentSchema
  >;