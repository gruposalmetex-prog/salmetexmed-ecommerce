export function formatPrice(
    priceInCents: number,
) {
    return new Intl.NumberFormat("es-MX", {
        style: "currency",
        currency: "MXN",
    }).format(priceInCents / 100);
}