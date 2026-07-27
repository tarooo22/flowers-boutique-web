/**
 * gscAPI.ts
 * Google Search Console API integration for fetching keyword rankings
 * Requires: Google OAuth setup with Search Console API enabled
 */

import axios from "axios";

interface GSCRankingData {
  query: string;
  page: string;
  position: number;
  impressions: number;
  clicks: number;
  ctr: number;
}

interface GSCSearchAnalyticsRequest {
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  dimensions: string[];
  rowLimit?: number;
  filters?: Array<{
    dimension: string;
    operator: string;
    expression: string;
  }>;
}

/**
 * Fetch ranking data from Google Search Console API
 * Note: This requires valid OAuth credentials and Search Console API enabled
 */
export async function fetchGSCRankings(
  siteUrl: string,
  accessToken: string,
  filters?: {
    startDate?: string;
    endDate?: string;
    queries?: string[];
  }
): Promise<GSCRankingData[]> {
  try {
    // Get last 7 days of data by default
    const endDate = new Date();
    const startDate = new Date(endDate.getTime() - 7 * 24 * 60 * 60 * 1000);

    const request: GSCSearchAnalyticsRequest = {
      startDate: filters?.startDate || startDate.toISOString().split("T")[0],
      endDate: filters?.endDate || endDate.toISOString().split("T")[0],
      dimensions: ["query", "page"],
      rowLimit: 25000,
    };

    // If specific queries provided, add filter
    if (filters?.queries && filters.queries.length > 0) {
      request.filters = filters.queries.map((query) => ({
        dimension: "query",
        operator: "equals",
        expression: query,
      }));
    }

    const encodedSiteUrl = encodeURIComponent(siteUrl);
    const response = await axios.post(
      `https://www.googleapis.com/webmasters/v3/sites/${encodedSiteUrl}/searchAnalytics/query`,
      request,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    // Parse response and extract ranking data
    const rankings: GSCRankingData[] = [];
    if (response.data.rows) {
      for (const row of response.data.rows) {
        rankings.push({
          query: row.keys[0],
          page: row.keys[1],
          position: row.position,
          impressions: row.impressions || 0,
          clicks: row.clicks || 0,
          ctr: row.ctr || 0,
        });
      }
    }

    return rankings;
  } catch (error) {
    console.error("[GSC API] Error fetching rankings:", error);
    throw error;
  }
}

/**
 * Get average ranking position for a specific query
 */
export function getAveragePosition(rankings: GSCRankingData[]): number {
  if (rankings.length === 0) return 0;
  const sum = rankings.reduce((acc, r) => acc + r.position, 0);
  return Math.round((sum / rankings.length) * 100) / 100;
}

/**
 * Get total impressions for rankings
 */
export function getTotalImpressions(rankings: GSCRankingData[]): number {
  return rankings.reduce((acc, r) => acc + r.impressions, 0);
}

/**
 * Get total clicks for rankings
 */
export function getTotalClicks(rankings: GSCRankingData[]): number {
  return rankings.reduce((acc, r) => acc + r.clicks, 0);
}

/**
 * Calculate average CTR
 */
export function getAverageCTR(rankings: GSCRankingData[]): number {
  if (rankings.length === 0) return 0;
  const avgCtr = rankings.reduce((acc, r) => acc + r.ctr, 0) / rankings.length;
  return Math.round(avgCtr * 100) / 100;
}

/**
 * Filter rankings by position threshold
 */
export function filterByPosition(
  rankings: GSCRankingData[],
  maxPosition: number
): GSCRankingData[] {
  return rankings.filter((r) => r.position <= maxPosition);
}

/**
 * Sort rankings by position
 */
export function sortByPosition(rankings: GSCRankingData[]): GSCRankingData[] {
  return [...rankings].sort((a, b) => a.position - b.position);
}
