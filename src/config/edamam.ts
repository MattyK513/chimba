import { getRequiredEnvVar } from "./env";

export const appId = getRequiredEnvVar("VITE_EDAMAM_APP_ID");
export const appKey = getRequiredEnvVar("VITE_EDAMAM_APP_KEY");
