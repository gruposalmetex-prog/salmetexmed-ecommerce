export function getAdminProductFormValues(
    formData: FormData,
  ) {
    return {
      name:
        formData.get("name"),

      slug:
        formData.get("slug"),

      brandId:
        formData.get("brandId"),

      categoryIds:
        formData
          .getAll("categoryIds")
          .map(String),

      shortDescription:
        formData.get(
          "shortDescription",
        ),

      description:
        formData.get("description"),

      saleMode:
        formData.get("saleMode"),

      featured:
        formData.get("featured") ===
        "on",

      seoTitle:
        String(
          formData.get("seoTitle") ??
            "",
        ).trim() || undefined,

      seoDescription:
        String(
          formData.get(
            "seoDescription",
          ) ?? "",
        ).trim() || undefined,
    };
  }