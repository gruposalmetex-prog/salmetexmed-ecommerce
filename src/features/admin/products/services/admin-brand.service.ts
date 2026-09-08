import type {
    CreateAdminBrandInput,
    UpdateAdminBrandInput,
} from "../schemas/admin-brand.schema";

import {
    createAdminBrand as createAdminBrandRecord,
    findAdminBrandById,
    findAdminBrandBySlug,
    listAdminBrands,
    updateAdminBrand as updateAdminBrandRecord,
} from "../repositories/admin-brand.repository";

export type AdminBrandErrorCode =
    | "brand_not_found"
    | "brand_slug_exists"
    | "brand_creation_failed"
    | "brand_update_failed";

export class AdminBrandError extends Error {
    constructor(
        public readonly code: AdminBrandErrorCode,
        message: string,
    ) {
        super(message);

        this.name = "AdminBrandError";
    }
}

export async function getAdminBrands() {
    return listAdminBrands();
}

export async function getAdminBrandById(
    brandId: string,
) {
    return findAdminBrandById(
        brandId,
    );
}

export async function createAdminBrand(
    input: CreateAdminBrandInput,
) {
    const existingBrand =
        await findAdminBrandBySlug(
            input.slug,
        );

    if (existingBrand) {
        throw new AdminBrandError(
            "brand_slug_exists",
            "Ya existe una marca con ese slug.",
        );
    }

    const brand =
        await createAdminBrandRecord(
            input,
        );

    if (!brand) {
        throw new AdminBrandError(
            "brand_creation_failed",
            "No fue posible crear la marca.",
        );
    }

    return brand;
}

export async function updateAdminBrand(
    input: UpdateAdminBrandInput,
) {
    const currentBrand =
        await findAdminBrandById(
            input.id,
        );

    if (!currentBrand) {
        throw new AdminBrandError(
            "brand_not_found",
            "La marca no existe.",
        );
    }

    const brandWithSlug =
        await findAdminBrandBySlug(
            input.slug,
        );

    if (
        brandWithSlug &&
        brandWithSlug.id !== input.id
    ) {
        throw new AdminBrandError(
            "brand_slug_exists",
            "Ya existe otra marca con ese slug.",
        );
    }

    const updatedBrand =
        await updateAdminBrandRecord(
            input,
        );

    if (!updatedBrand) {
        throw new AdminBrandError(
            "brand_update_failed",
            "No fue posible actualizar la marca.",
        );
    }

    return {
        ...updatedBrand,
        previousSlug:
            currentBrand.slug,
    };
}