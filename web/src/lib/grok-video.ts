import { modelOptionName, resolveModelRequestConfig, type AiConfig } from "@/stores/use-config-store";

export const grokVideoResolutionOptions = ["480p", "720p", "1080p"] as const;
export const grokVideoRatioOptions = ["16:9", "9:16", "1:1", "4:3", "3:4", "3:2", "2:3"] as const;
export const grokVideoDurationOptions = [5, 8, 10, 12, 15] as const;

export function isGrokVideoConfig(config: AiConfig | Pick<AiConfig, "model" | "videoModel" | "apiFormat">) {
    const requestConfig = "channels" in config ? resolveModelRequestConfig(config, config.model || config.videoModel) : config;
    return requestConfig.apiFormat === "grok" || isGrokVideoModel(modelOptionName(requestConfig.model || requestConfig.videoModel));
}

export function isGrokVideoModel(model: string) {
    return model.trim().toLowerCase().startsWith("grok-imagine-video");
}

export function isGrokVideo15Model(model: string) {
    return model.trim().toLowerCase().startsWith("grok-imagine-video-1.5");
}

export function normalizeGrokVideoResolution(value: string) {
    if (value === "low") return "480p";
    if (value === "auto" || value === "high" || value === "medium") return "720p";
    const resolution = `${String(value || "720").replace(/p$/i, "")}p`;
    return grokVideoResolutionOptions.includes(resolution as (typeof grokVideoResolutionOptions)[number]) ? resolution : "720p";
}

export function normalizeGrokVideoDuration(value: string) {
    const seconds = Math.floor(Number(value) || 5);
    return Math.max(1, Math.min(15, seconds));
}

export function normalizeGrokVideoRatio(value: string) {
    if (grokVideoRatioOptions.includes(value as (typeof grokVideoRatioOptions)[number])) return value;
    const match = value.match(/^(\d+)x(\d+)$/);
    if (!match) return "16:9";
    const width = Number(match[1]);
    const height = Number(match[2]);
    if (!width || !height) return "16:9";
    const ratio = width / height;
    return grokVideoRatioOptions.reduce<string>((best, item) => (Math.abs(readRatio(item) - ratio) < Math.abs(readRatio(best) - ratio) ? item : best), grokVideoRatioOptions[0]);
}

function readRatio(value: string) {
    const [width, height] = value.split(":").map(Number);
    return width / height;
}
