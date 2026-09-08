import { z } from "zod";

export const contactFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(
      2,
      "Escribe tu nombre",
    )
    .max(
      120,
      "El nombre es demasiado largo",
    ),

  email: z
    .string()
    .trim()
    .email(
      "Escribe un correo válido",
    )
    .max(180),

  phone: z
    .string()
    .trim()
    .refine(
      (value) =>
        value.replace(/\D/g, "")
          .length >= 10,
      "Escribe un teléfono válido",
    ),

  company: z
    .string()
    .trim()
    .max(160)
    .optional(),

  message: z
    .string()
    .trim()
    .min(
      10,
      "Escribe un mensaje de al menos 10 caracteres",
    )
    .max(
      1500,
      "El mensaje es demasiado largo",
    ),
});

export type ContactFormValues =
  z.output<
    typeof contactFormSchema
  >;