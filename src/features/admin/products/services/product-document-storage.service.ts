import "server-only";

import {
    randomUUID,
} from "node:crypto";

import type {
    UploadApiResponse,
} from "cloudinary";

import { getCloudinary } from "@/lib/cloudinary";

const MAX_DOCUMENT_SIZE =
    10 * 1024 * 1024;

const PDF_MIME_TYPE =
    "application/pdf";

const PDF_SIGNATURE =
    "%PDF-";

export type ProductDocumentStorageErrorCode =
    | "empty_file"
    | "unsupported_type"
    | "file_too_large"
    | "invalid_pdf"
    | "upload_failed"
    | "asset_not_found"
    | "invalid_asset";

export class ProductDocumentStorageError extends Error {
    constructor(
        public readonly code:
            ProductDocumentStorageErrorCode,
        message: string,
    ) {
        super(message);

        this.name =
            "ProductDocumentStorageError";
    }
}

export interface StoredProductDocument {
    publicId: string;
    url: string;
    fileName: string;
    mimeType: string;
    bytes: number;
}

export interface VerifiedProductDocumentAsset {
    publicId: string;
    url: string;
    mimeType: string;
    bytes: number;
}

function normalizeFileName(
    fileName: string,
) {
    const normalized =
        fileName
            .split(/[\\/]/)
            .pop()
            ?.trim() ||
        "documento.pdf";

    return normalized.slice(0, 255);
}

function uploadDocumentBuffer(
    buffer: Buffer,
    productId: string,
): Promise<UploadApiResponse> {
    const cloudinary =
        getCloudinary();

    return new Promise(
        (resolve, reject) => {
            const uploadStream =
                cloudinary.uploader.upload_stream(
                    {
                        resource_type: "raw",

                        folder:
                            `salmetexmed/products/${productId}/documents`,

                        public_id:
                            `${randomUUID()}.pdf`,

                        overwrite: false,
                    },
                    (error, result) => {
                        if (error) {
                            reject(error);
                            return;
                        }

                        if (!result) {
                            reject(
                                new Error(
                                    "Cloudinary no devolvió el resultado de la carga",
                                ),
                            );
                            return;
                        }

                        resolve(result);
                    },
                );

            uploadStream.end(buffer);
        },
    );
}

export async function uploadProductDocument(
    file: File,
    productId: string,
): Promise<StoredProductDocument> {
    if (!file || file.size === 0) {
        throw new ProductDocumentStorageError(
            "empty_file",
            "Selecciona un documento PDF.",
        );
    }

    if (file.type !== PDF_MIME_TYPE) {
        throw new ProductDocumentStorageError(
            "unsupported_type",
            "El documento debe estar en formato PDF.",
        );
    }

    if (
        !file.name
            .toLowerCase()
            .endsWith(".pdf")
    ) {
        throw new ProductDocumentStorageError(
            "unsupported_type",
            "El archivo debe tener extensión .pdf.",
        );
    }

    if (
        file.size >
        MAX_DOCUMENT_SIZE
    ) {
        throw new ProductDocumentStorageError(
            "file_too_large",
            "El documento no puede superar 10 MB.",
        );
    }

    const arrayBuffer =
        await file.arrayBuffer();

    const buffer =
        Buffer.from(arrayBuffer);

    const signature =
        buffer
            .subarray(
                0,
                PDF_SIGNATURE.length,
            )
            .toString("ascii");

    if (
        signature !==
        PDF_SIGNATURE
    ) {
        throw new ProductDocumentStorageError(
            "invalid_pdf",
            "El archivo seleccionado no contiene un PDF válido.",
        );
    }

    let uploaded:
        UploadApiResponse;

    try {
        uploaded =
            await uploadDocumentBuffer(
                buffer,
                productId,
            );
    } catch (error) {
        console.error(
            "No fue posible subir el documento a Cloudinary:",
            error,
        );

        throw new ProductDocumentStorageError(
            "upload_failed",
            "No fue posible subir el documento. Inténtalo nuevamente.",
        );
    }

    if (
        !uploaded.public_id ||
        !uploaded.secure_url ||
        typeof uploaded.bytes !==
        "number"
    ) {
        try {
            if (uploaded.public_id) {
                await deleteProductDocument(
                    uploaded.public_id,
                );
            }
        } catch {
            // Conservamos el error original.
        }

        throw new ProductDocumentStorageError(
            "upload_failed",
            "Cloudinary devolvió información incompleta del documento.",
        );
    }

    return {
        publicId:
            uploaded.public_id,

        url:
            uploaded.secure_url,

        fileName:
            normalizeFileName(
                file.name,
            ),

        mimeType:
            PDF_MIME_TYPE,

        bytes:
            uploaded.bytes,
    };
}
export async function verifyUploadedProductDocument(
    publicId: string,
    productId: string,
): Promise<VerifiedProductDocumentAsset> {
    const expectedPrefix =
        `salmetexmed/products/${productId}/documents/`;

    if (
        !publicId.startsWith(
            expectedPrefix,
        ) ||
        !publicId
            .toLowerCase()
            .endsWith(".pdf")
    ) {
        throw new ProductDocumentStorageError(
            "invalid_asset",
            "El documento no pertenece al producto indicado.",
        );
    }

    const cloudinary =
        getCloudinary();

    let asset;

    try {
        asset =
            await cloudinary.api.resource(
                publicId,
                {
                    resource_type: "raw",
                    type: "upload",
                },
            );
    } catch (error) {
        console.error(
            "No fue posible consultar el documento en Cloudinary:",
            error,
        );

        throw new ProductDocumentStorageError(
            "asset_not_found",
            "No fue posible verificar el documento subido.",
        );
    }

    if (
        asset.public_id !== publicId ||
        asset.resource_type !== "raw" ||
        typeof asset.secure_url !==
        "string" ||
        typeof asset.bytes !==
        "number"
    ) {
        throw new ProductDocumentStorageError(
            "invalid_asset",
            "Cloudinary devolvió información inválida del documento.",
        );
    }

    if (
        asset.bytes <= 0
    ) {
        throw new ProductDocumentStorageError(
            "invalid_asset",
            "El documento almacenado está vacío.",
        );
    }

    if (
        asset.bytes >
        MAX_DOCUMENT_SIZE
    ) {
        throw new ProductDocumentStorageError(
            "file_too_large",
            "El documento no puede superar 25 MB.",
        );
    }

    return {
        publicId:
            asset.public_id,

        url:
            asset.secure_url,

        mimeType:
            PDF_MIME_TYPE,

        bytes:
            asset.bytes,
    };
}

export async function deleteProductDocument(
    publicId: string,
) {
    const cloudinary =
        getCloudinary();

    await cloudinary.uploader.destroy(
        publicId,
        {
            resource_type: "raw",
            invalidate: true,
        },
    );
}