/**
 * Shared Geoapify Service
 * Handles all autocomplete and reverse geocoding requests with proper error handling
 */

interface AutocompleteResult {
  formatted: string;
  lat: number;
  lon: number;
  placeId?: string;
  address_line1?: string;
  address_line2?: string;
}

interface ReverseGeocodeResult {
  formatted: string;
  lat: number;
  lon: number;
}

interface GeoapifyError {
  status: number;
  message: string;
  type: "autocomplete" | "reverse";
}

const API_KEY = import.meta.env.VITE_GEOAPIFY_API_KEY;
const TBILISI_CENTER = { lat: 41.7151, lon: 44.8271 };

// Debug: Log API key status on module load
if (typeof window !== 'undefined') {
  console.log('[Geoapify] Service initialized. API key present:', !!API_KEY);
  if (!API_KEY) {
    console.warn('[Geoapify] WARNING: VITE_GEOAPIFY_API_KEY not configured. Address search will not work.');
  }
}

/**
 * Autocomplete address search
 */
export async function searchAddresses(
  query: string,
  language: "en" | "ka" = "ka"
): Promise<AutocompleteResult[] | GeoapifyError> {
  if (!query || query.length < 2) {
    return [];
  }

  if (!API_KEY) {
    console.error("[Geoapify] API key not configured");
    return {
      status: 500,
      message: "API key not configured",
      type: "autocomplete",
    };
  }

  try {
    const url = new URL("https://api.geoapify.com/v1/geocode/autocomplete");
    url.searchParams.append("text", query.trim());
    url.searchParams.append("format", "json");
    url.searchParams.append("filter", "countrycode:ge");
    url.searchParams.append("bias", `proximity:${TBILISI_CENTER.lon},${TBILISI_CENTER.lat}`);
    url.searchParams.append("limit", "8");
    url.searchParams.append("lang", language);
    url.searchParams.append("apiKey", API_KEY);

    const response = await fetch(url.toString());

    if (!response.ok) {
      const error: GeoapifyError = {
        status: response.status,
        message: `HTTP ${response.status}`,
        type: "autocomplete",
      };

      const keyPreview = API_KEY ? `${API_KEY.substring(0, 8)}...${API_KEY.substring(API_KEY.length - 4)}` : 'MISSING';
      console.error("[Geoapify] Autocomplete error:", {
        status: response.status,
        statusText: response.statusText,
        origin: window.location.origin,
        keyConfigured: !!API_KEY,
        keyPreview,
        url: url.toString(),
      });

      return error;
    }

    const data = await response.json();
    const results = data.results || [];

    return results.map((result: any) => ({
      formatted: result.formatted || result.address_line1 || "",
      lat: result.lat,
      lon: result.lon,
      placeId: result.place_id,
      address_line1: result.address_line1,
      address_line2: result.address_line2,
    }));
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error("[Geoapify] Autocomplete network error:", errorMsg, error);
    return {
      status: 0,
      message: "Network error",
      type: "autocomplete",
    };
  }
}

/**
 * Reverse geocode coordinates to get address
 */
export async function reverseGeocode(
  lat: number,
  lon: number,
  language: "en" | "ka" = "ka"
): Promise<ReverseGeocodeResult | GeoapifyError> {
  if (!API_KEY) {
    console.error("[Geoapify] API key not configured");
    return {
      status: 500,
      message: "API key not configured",
      type: "reverse",
    };
  }

  try {
    const url = new URL("https://api.geoapify.com/v1/geocode/reverse");
    url.searchParams.append("lat", lat.toString());
    url.searchParams.append("lon", lon.toString());
    url.searchParams.append("format", "json");
    url.searchParams.append("lang", language);
    url.searchParams.append("apiKey", API_KEY);

    const response = await fetch(url.toString());

    if (!response.ok) {
      const error: GeoapifyError = {
        status: response.status,
        message: `HTTP ${response.status}`,
        type: "reverse",
      };

      const keyPreview = API_KEY ? `${API_KEY.substring(0, 8)}...${API_KEY.substring(API_KEY.length - 4)}` : 'MISSING';
      console.error("[Geoapify] Reverse geocoding error:", {
        status: response.status,
        statusText: response.statusText,
        origin: window.location.origin,
        keyConfigured: !!API_KEY,
        keyPreview,
        url: url.toString(),
      });

      return error;
    }

    const data = await response.json();
    const features = data.features || [];

    if (features.length === 0) {
      return {
        formatted: `${lat.toFixed(4)}, ${lon.toFixed(4)}`,
        lat,
        lon,
      };
    }

    const feature = features[0];
    const props = feature.properties || {};

    return {
      formatted: props.formatted || props.address_line1 || `${lat.toFixed(4)}, ${lon.toFixed(4)}`,
      lat,
      lon,
    };
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error("[Geoapify] Reverse geocoding network error:", errorMsg, error);
    return {
      status: 0,
      message: "Network error",
      type: "reverse",
    };
  }
}

/**
 * Check if result is an error
 */
export function isGeoapifyError(result: any): result is GeoapifyError {
  return result && typeof result === "object" && "status" in result && "type" in result;
}
