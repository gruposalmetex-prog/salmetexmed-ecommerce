import { z } from "zod";

export const cartItemSchema = z
    .object({
        variantId: z
            .string()
            .uuid("La variante no es válida"),

        quantity: z.coerce
            .number()
            .int("La cantidad debe ser un entero")
            .min(1, "La cantidad mínima es 1")
            .max(99, "La cantidad máxima es 99"),
    })
    .strict();

export const cartSchema = z
    .array(cartItemSchema)
    .max(
        50,
        "El carrito no puede contener más de 50 variantes",
    )
    .superRefine((items, context) => {
        const variantIds = new Set<string>();

        items.forEach((item, index) => {
            if (variantIds.has(item.variantId)) {
                context.addIssue({
                    code: "custom",
                    path: [index, "variantId"],
                    message:
                        "La variante está duplicada en el carrito",
                });

                return;
            }

            variantIds.add(item.variantId);
        });
    });

export type CartItemInput = z.input<
    typeof cartItemSchema
>;

export type ValidatedCartItem = z.output<
    typeof cartItemSchema
>;

export type CartInput = z.input<
    typeof cartSchema
>;

export type ValidatedCart = z.output<
    typeof cartSchema
>;