/**
 * seoMonitoringHandler.ts
 * Scheduled task handler for weekly keyword ranking monitoring
 * Called every Monday at 9 AM UTC
 */

import { Request, Response } from "express";
import { sdk } from "../_core/sdk";
import { generateWeeklyReport, initializeDefaultKeywords } from "../seoRankingTracker";
import { notifyOwner } from "../_core/notification";

export async function handleSeoMonitoring(req: Request, res: Response) {
  try {
    // Authenticate as cron task
    const user = await sdk.authenticateRequest(req);
    if (!user.isCron || !user.taskUid) {
      return res.status(403).json({ error: "cron-only" });
    }

    console.log("[SEO Monitoring] Starting weekly keyword ranking check...");

    // Initialize default keywords if not already done
    try {
      await initializeDefaultKeywords();
    } catch (error) {
      console.log("[SEO Monitoring] Keywords already initialized or error:", error);
    }

    // Generate weekly report
    const report = await generateWeeklyReport();

    console.log("[SEO Monitoring] Report generated:", {
      totalKeywords: report.totalKeywords,
      keywordsInTop10: report.keywordsInTop10,
      keywordsInTop20: report.keywordsInTop20,
      totalSearchVolume: report.totalSearchVolume,
      averageDifficulty: report.averageDifficulty,
    });

    // Format report for email
    const reportSummary = formatReportForEmail(report);

    // Send notification to owner
    try {
      await notifyOwner({
        title: "📊 Weekly SEO Ranking Report - Flower’s Boutique",
        content: reportSummary,
      });
      console.log("[SEO Monitoring] Notification sent to owner");
    } catch (error) {
      console.error("[SEO Monitoring] Error sending notification:", error);
      // Don't fail the task if notification fails
    }

    // Return success response
    res.json({
      ok: true,
      message: "Weekly SEO monitoring completed",
      report: {
        generatedAt: report.generatedAt,
        totalKeywords: report.totalKeywords,
        keywordsInTop10: report.keywordsInTop10,
        keywordsInTop20: report.keywordsInTop20,
        totalSearchVolume: report.totalSearchVolume,
        averageDifficulty: report.averageDifficulty,
      },
    });
  } catch (error) {
    console.error("[SEO Monitoring] Error:", error);
    res.status(500).json({
      error: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
      context: {
        url: req.url,
        timestamp: new Date().toISOString(),
      },
    });
  }
}

/**
 * Format report for email notification
 */
function formatReportForEmail(report: any): string {
  const lines = [
    "📊 **Weekly SEO Ranking Report**",
    "",
    `Generated: ${new Date(report.generatedAt).toLocaleDateString()}`,
    "",
    "**Summary:**",
    `• Total Keywords Tracked: ${report.totalKeywords}`,
    `• Keywords in Top 10: ${report.keywordsInTop10}`,
    `• Keywords in Top 20: ${report.keywordsInTop20}`,
    `• Total Search Volume: ${report.totalSearchVolume.toLocaleString()}`,
    `• Average Difficulty: ${report.averageDifficulty}`,
    "",
    "**Top Performing Keywords:**",
  ];

  // Add top 5 keywords by position
  if (report.rankings && report.rankings.length > 0) {
    const topKeywords = report.rankings
      .filter((r: any) => r.rank && r.rank <= 20)
      .sort((a: any, b: any) => (a.rank || 100) - (b.rank || 100))
      .slice(0, 5);

    if (topKeywords.length > 0) {
      topKeywords.forEach((kw: any) => {
        lines.push(
          `• "${kw.keyword}" - Position #${kw.rank} | Search volume: ${kw.searchVolume ?? "—"} | Difficulty: ${kw.difficulty ?? "—"}`
        );
      });
    } else {
      lines.push("• No keywords in top 20 yet");
    }
  }

  // Add ranking trends
  if (report.trends && report.trends.length > 0) {
    lines.push("");
    lines.push("**Ranking Trends (Last 2 Weeks):**");

    const improvingKeywords = report.trends.filter(
      (t: any) => t.trend === "improving"
    );
    const decliningKeywords = report.trends.filter(
      (t: any) => t.trend === "declining"
    );

    if (improvingKeywords.length > 0) {
      lines.push("📈 **Improving:**");
      improvingKeywords.slice(0, 3).forEach((t: any) => {
        lines.push(
          `• "${t.keyword}" improved from #${t.oldPosition} to #${t.newPosition}`
        );
      });
    }

    if (decliningKeywords.length > 0) {
      lines.push("📉 **Declining:**");
      decliningKeywords.slice(0, 3).forEach((t: any) => {
        lines.push(
          `• "${t.keyword}" declined from #${t.oldPosition} to #${t.newPosition}`
        );
      });
    }
  }

  lines.push("");
  lines.push("---");
  lines.push("Check Google Search Console for detailed analytics:");
  lines.push("https://search.google.com/search-console/");

  return lines.join("\n");
}
