import "server-only";

import {
    and,
    eq,
} from "drizzle-orm";

import { getDatabase } from "@/db";
import {
    productDocuments,
    products,
} from "@/db/schema";

import type {
    CreateAdminProductDocumentInput,
} from "../schemas/admin-product-document.schema";

import type {
    ProductDocumentType,
} from "../schemas/admin-product-document.schema";

export interface InsertAdminProductDocumentInput
    extends CreateAdminProductDocumentInput {
    fileName: string;
    publicId: string;
    url: string;
    mimeType: string;
    bytes: number;
}

export async function findAdminProductDocumentContext(
    productId: string,
) {
    const db = getDatabase();

    const [product] = await db
        .select({
            id: products.id,
            slug: products.slug,
            status: products.status,

        })
        .from(products)
        .where(
            eq(
                products.id,
                productId,
            ),
        )
        .limit(1);

    return product ?? null;
}

export async function insertAdminProductDocument(
    input: InsertAdminProductDocumentInput,
) {
    const db = getDatabase();

    const [document] = await db
        .insert(productDocuments)
        .values({
            productId:
                input.productId,

            documentType:
                input.documentType,

            title:
                input.title,

            fileName:
                input.fileName,

            publicId:
                input.publicId,

            url:
                input.url,

            mimeType:
                input.mimeType,

            bytes:
                input.bytes,
        })
        .returning({
            id:
                productDocuments.id,

            productId:
                productDocuments.productId,

            documentType:
                productDocuments.documentType,

            title:
                productDocuments.title,

            fileName:
                productDocuments.fileName,

            url:
                productDocuments.url,
        });

    if (!document) {
        throw new Error(
            "No fue posible guardar el documento",
        );
    }

    return document;
}

export async function findAdminProductDocumentByPublicId(
    publicId: string,
) {
    const db = getDatabase();

    const [document] = await db
        .select({
            id:
                productDocuments.id,

            productId:
                productDocuments.productId,
        })
        .from(productDocuments)
        .where(
            eq(
                productDocuments.publicId,
                publicId,
            ),
        )
        .limit(1);

    return document ?? null;
}

export async function findAdminProductDocumentByType(
    productId: string,
    documentType: ProductDocumentType,
) {
    const db = getDatabase();

    const [document] = await db
        .select({
            id:
                productDocuments.id,
        })
        .from(productDocuments)
        .where(
            and(
                eq(
                    productDocuments.productId,
                    productId,
                ),

                eq(
                    productDocuments.documentType,
                    documentType,
                ),
            ),
        )
        .limit(1);

    return document ?? null;
}

export async function deleteAdminProductDocumentRecord(
    productId: string,
    documentId: string,
) {
    const db = getDatabase();

    return db.transaction(
        async (transaction) => {
            const [document] =
                await transaction
                    .select({
                        id:
                            productDocuments.id,

                        productId:
                            productDocuments.productId,

                        publicId:
                            productDocuments.publicId,

                        documentType:
                            productDocuments.documentType,

                        title:
                            productDocuments.title,
                    })
                    .from(productDocuments)
                    .where(
                        and(
                            eq(
                                productDocuments.id,
                                documentId,
                            ),

                            eq(
                                productDocuments.productId,
                                productId,
                            ),
                        ),
                    )
                    .limit(1);

            if (!document) {
                return null;
            }

            await transaction
                .delete(productDocuments)
                .where(
                    and(
                        eq(
                            productDocuments.id,
                            documentId,
                        ),

                        eq(
                            productDocuments.productId,
                            productId,
                        ),
                    ),
                );

            return document;
        },
    );
}
