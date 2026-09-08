import { z } from "zod";

export const adminAreaImageSchema = z.object({
  areaId: z.uuid(
    "El identificador del área no es válido.",
  ),
});

export type AdminAreaImageInput = z.infer<
  typeof adminAreaImageSchema
>;