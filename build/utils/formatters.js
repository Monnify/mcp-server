export function formatCurrency(amount, currency = "NGN") {
    return new Intl.NumberFormat("en-NG", {
        style: "currency",
        currency,
        minimumFractionDigits: 2,
    }).format(amount);
}
export function formatDate(dateString) {
    try {
        return new Date(dateString).toISOString();
    }
    catch {
        return dateString;
    }
}
export function buildQueryString(params) {
    const searchParams = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
        if (value !== undefined) {
            searchParams.set(key, String(value));
        }
    }
    const qs = searchParams.toString();
    return qs ? `?${qs}` : "";
}
//# sourceMappingURL=formatters.js.map