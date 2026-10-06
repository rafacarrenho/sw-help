export const PRIVACY_PREFERENCES_KEY = 'playerdojo:privacy-preferences';
export const LEGACY_ANALYTICS_KEY = 'playerdojo:analytics-consent';
export const PRIVACY_PREFERENCES_EVENT = 'playerdojo:privacy-preferences';

export interface PrivacyPreferences {
  version: 1;
  analytics: boolean;
  personalizedAds: boolean;
  updatedAt: string;
}

export type AdvertisingMode = 'blocked' | 'contextual' | 'personalized';

export function parsePrivacyPreferences(
  value: string | null,
): PrivacyPreferences | null {
  if (!value) return null;

  try {
    const parsed = JSON.parse(value) as Partial<PrivacyPreferences>;
    if (
      parsed.version !== 1 ||
      typeof parsed.analytics !== 'boolean' ||
      typeof parsed.personalizedAds !== 'boolean' ||
      typeof parsed.updatedAt !== 'string' ||
      Number.isNaN(Date.parse(parsed.updatedAt))
    ) {
      return null;
    }

    return parsed as PrivacyPreferences;
  } catch {
    return null;
  }
}

export function createPrivacyPreferences(
  analytics: boolean,
  personalizedAds: boolean,
  updatedAt = new Date(),
): PrivacyPreferences {
  return {
    version: 1,
    analytics,
    personalizedAds,
    updatedAt: updatedAt.toISOString(),
  };
}

export function readLegacyAnalyticsChoice(value: string | null): boolean {
  return value === 'accepted';
}

export function selectAdvertisingMode(
  preferences: PrivacyPreferences | null,
  contextualConfigured: boolean,
  personalizedConfigured: boolean,
): AdvertisingMode {
  if (!preferences) return contextualConfigured ? 'contextual' : 'blocked';
  if (preferences.personalizedAds) {
    return personalizedConfigured ? 'personalized' : 'blocked';
  }
  return contextualConfigured ? 'contextual' : 'blocked';
}
