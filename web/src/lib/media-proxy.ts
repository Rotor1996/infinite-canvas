const XAI_VIDGEN_ORIGIN = "https://vidgen.x.ai";
const XAI_VIDGEN_BUCKET_PREFIX = "/xai-vidgen-bucket/";
const XAI_VIDGEN_PROXY_PREFIX = "/media-proxy/xai-vidgen-bucket/";

export function proxiedMediaUrl(url: string) {
    if (!url || url.startsWith("blob:") || url.startsWith("data:") || url.startsWith("asset://") || url.startsWith(XAI_VIDGEN_PROXY_PREFIX)) return url;
    try {
        const parsed = new URL(url);
        if (parsed.origin !== XAI_VIDGEN_ORIGIN || !parsed.pathname.startsWith(XAI_VIDGEN_BUCKET_PREFIX)) return url;
        return `${XAI_VIDGEN_PROXY_PREFIX}${parsed.pathname.slice(XAI_VIDGEN_BUCKET_PREFIX.length)}${parsed.search}`;
    } catch {
        return url;
    }
}

export function absoluteProxiedMediaUrl(url: string) {
    if (!url?.startsWith(XAI_VIDGEN_PROXY_PREFIX) || typeof window === "undefined") return url;
    return new URL(url, window.location.origin).toString();
}
