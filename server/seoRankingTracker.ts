/**
 * seoRankingTracker.ts
 * Service for tracking keyword rankings and generating reports
 */

import { getDb } from "./db";
import { seoKeywords, keywordRankings, seoMonitoringTasks } from "../drizzle/schema";
import { eq, and } from "drizzle-orm";

interface RankingRecord {
  keywordId: number;
  position: number | null;
  impressions: number;
  clicks: number;
  ctr: string;
}

/**
 * Initialize default keywords for monitoring
 * Called once during setup
 */
export async function initializeDefaultKeywords() {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const defaultKeywords = [
    {
      keyword: "Flower delivery Tbilisi",
      keywordKa: "ყვავილების მიტანა თბილისში",
      landingPageUrl: "/flower-delivery-tbilisi",
      targetPosition: 5,
      priority: "high",
    },
    {
      keyword: "Flower shop Tbilisi",
      keywordKa: "ყვავილების მაღაზია თბილისში",
      landingPageUrl: "/flower-shop-tbilisi",
      targetPosition: 5,
      priority: "high",
    },
    {
      keyword: "Rose bouquets",
      keywordKa: "ვარდების თაიგულები",
      landingPageUrl: "/rose-bouquets",
      targetPosition: 10,
      priority: "medium",
    },
    {
      keyword: "Lily bouquets",
      keywordKa: "ლილიების თაიგულები",
      landingPageUrl: "/lily-bouquets",
      targetPosition: 10,
      priority: "medium",
    },
    {
      keyword: "Spray roses",
      keywordKa: "სპრეი ვარდები",
      landingPageUrl: "/spray-roses",
      targetPosition: 10,
      priority: "medium",
    },
    {
      keyword: "Birthday flowers",
      keywordKa: "დაბადების დღის ყვავილები",
      landingPageUrl: "/birthday-flowers",
      targetPosition: 10,
      priority: "medium",
    },
  ];

  try {
    for (const kw of defaultKeywords) {
      // Check if keyword already exists
      const existing = await db
        .select()
        .from(seoKeywords)
        .where(eq(seoKeywords.keyword, kw.keyword))
        .limit(1);

      if (existing.length === 0) {
        await db.insert(seoKeywords).values({
          keyword: kw.keyword,
          keywordKa: kw.keywordKa,
          landingPageUrl: kw.landingPageUrl,
          targetPosition: kw.targetPosition,
          priority: kw.priority as "high" | "medium" | "low",
          isActive: true,
        });
      }
    }

    console.log("[SEO Tracker] Default keywords initialized");
  } catch (error) {
    console.error("[SEO Tracker] Error initializing keywords:", error);
    throw error;
  }
}

/**
 * Record ranking data for keywords
 */
export async function recordKeywordRankings(
  rankings: RankingRecord[]
): Promise<void> {
  try {
    const db = await getDb();
    if (!db) throw new Error("Database not available");

    for (const ranking of rankings) {
      await db.insert(keywordRankings).values({
        keywordId: ranking.keywordId,
        rank: ranking.position,
        impressions: ranking.impressions,
        clicks: ranking.clicks,
        ctr: ranking.ctr,
        createdAt: new Date(),
      });
    }

    console.log(
      `[SEO Tracker] Recorded ${rankings.length} keyword rankings`
    );
  } catch (error) {
    console.error("[SEO Tracker] Error recording rankings:", error);
    throw error;
  }
}

/**
 * Get latest rankings for all active keywords
 */
export async function getLatestRankings() {
  try {
    const db = await getDb();
    if (!db) throw new Error("Database not available");

    const keywords = await db
      .select()
      .from(seoKeywords)
      .where(eq(seoKeywords.isActive, true));

    const rankings = [];

    for (const kw of keywords) {
      const latestRanking = await db
        .select()
        .from(keywordRankings)
        .where(eq(keywordRankings.keywordId, kw.id))
        .orderBy(keywordRankings.createdAt)
        .limit(1);

      if (latestRanking.length > 0) {
        rankings.push({
          keyword: kw.keyword,
          ...latestRanking[0],
        });
      }
    }

    return rankings;
  } catch (error) {
    console.error("[SEO Tracker] Error fetching latest rankings:", error);
    throw error;
  }
}

/**
 * Get ranking history for a keyword (last N records)
 */
export async function getRankingHistory(
  keywordId: number,
  days: number = 30
) {
  try {
    const db = await getDb();
    if (!db) throw new Error("Database not available");

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const history = await db
      .select()
      .from(keywordRankings)
      .where(
        and(
          eq(keywordRankings.keywordId, keywordId)
        )
      )
      .orderBy(keywordRankings.createdAt);

    return history.filter(
      (r) =>
        new Date(r.createdAt).getTime() >= startDate.getTime()
    );
  } catch (error) {
    console.error("[SEO Tracker] Error fetching ranking history:", error);
    throw error;
  }
}

/**
 * Calculate ranking trends (improvement/decline)
 */
export async function calculateRankingTrends() {
  try {
    const db = await getDb();
    if (!db) throw new Error("Database not available");

    const keywords = await db
      .select()
      .from(seoKeywords);

    const trends = [];

    for (const kw of keywords) {
      // Get rankings from last 2 weeks
      const twoWeeksAgo = new Date();
      twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);

      const recentRankings = await db
        .select()
        .from(keywordRankings)
        .where(eq(keywordRankings.keywordId, kw.id))
        .orderBy(keywordRankings.createdAt);

      const oldRankings = recentRankings.filter(
        (r: any) => new Date(r.createdAt).getTime() < twoWeeksAgo.getTime()
      );
      const newRankings = recentRankings.filter(
        (r: any) => new Date(r.createdAt).getTime() >= twoWeeksAgo.getTime()
      );

      if (oldRankings.length > 0 && newRankings.length > 0) {
        const oldAvgPosition =
          oldRankings.reduce((sum: number, r: any) => sum + (r.rank || 100), 0) /
          oldRankings.length;
        const newAvgPosition =
          newRankings.reduce((sum: number, r: any) => sum + (r.rank || 100), 0) /
          newRankings.length;

        const positionChange = oldAvgPosition - newAvgPosition;
        const trend = positionChange > 0 ? "improving" : "declining";

        trends.push({
          keyword: kw.keyword,
          oldPosition: Math.round(oldAvgPosition * 100) / 100,
          newPosition: Math.round(newAvgPosition * 100) / 100,
          change: Math.round(positionChange * 100) / 100,
          trend,
        });
      }
    }

    return trends;
  } catch (error) {
    console.error("[SEO Tracker] Error calculating trends:", error);
    throw error;
  }
}

/**
 * Generate weekly SEO report
 */
export async function generateWeeklyReport() {
  try {
    const rankings = await getLatestRankings();
    const trends = await calculateRankingTrends();

    const report = {
      generatedAt: new Date().toISOString(),
      totalKeywords: rankings.length,
      keywordsInTop10: rankings.filter((r) => r.rank && r.rank <= 10)
        .length,
      keywordsInTop20: rankings.filter((r) => r.rank && r.rank <= 20)
        .length,
      totalImpressions: rankings.reduce((sum: number, r: any) => sum + r.impressions, 0),
      totalClicks: rankings.reduce((sum: number, r: any) => sum + r.clicks, 0),
      averageCTR:
        Math.round(
          (rankings.reduce((sum: number, r: any) => sum + parseFloat(r.ctr), 0) /
            rankings.length) *
            100
        ) / 100,
      rankings,
      trends,
    };

    return report;
  } catch (error) {
    console.error("[SEO Tracker] Error generating report:", error);
    throw error;
  }
}

/**
 * Update monitoring task status
 */
export async function updateMonitoringTaskStatus(
  taskId: number,
  status: {
    lastRunAt?: Date;
    nextRunAt?: Date;
    isEnabled?: boolean;
  }
) {
  try {
    const db = await getDb();
    if (!db) throw new Error("Database not available");

    await db
      .update(seoMonitoringTasks)
      .set({
        lastRunAt: status.lastRunAt,
        nextRunAt: status.nextRunAt,
        isEnabled: status.isEnabled,
      })
      .where(eq(seoMonitoringTasks.id, taskId));
  } catch (error) {
    console.error("[SEO Tracker] Error updating task status:", error);
    throw error;
  }
}
