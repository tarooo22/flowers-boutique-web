import React, { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import { useLanguage } from "@/contexts/LanguageContext";

export function SEOMonitoring() {
  const { language } = useLanguage();
  const [selectedKeywordId, setSelectedKeywordId] = useState<number | null>(
    null
  );

  // Fetch latest rankings
  const { data: rankings, isLoading: rankingsLoading } =
    trpc.seo.getLatestRankings.useQuery();

  // Fetch ranking trends
  const { data: trends, isLoading: trendsLoading } =
    trpc.seo.getRankingTrends.useQuery();

  // Fetch weekly report
  const { data: report, isLoading: reportLoading } =
    trpc.seo.getWeeklyReport.useQuery();

  const isLoading = rankingsLoading || trendsLoading || reportLoading;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Spinner />
      </div>
    );
  }

  const getTrendBadge = (trend: string) => {
    if (trend === "improving") {
      return (
        <Badge className="bg-green-600">
          📈 {language === "ka" ? "უმჯობესდება" : "Improving"}
        </Badge>
      );
    }
    return (
      <Badge className="bg-red-600">
        📉 {language === "ka" ? "ქვეითდება" : "Declining"}
      </Badge>
    );
  };

  const getPositionColor = (position: number | null) => {
    if (!position) return "text-gray-500";
    if (position <= 3) return "text-green-600 font-bold";
    if (position <= 10) return "text-blue-600";
    if (position <= 20) return "text-yellow-600";
    return "text-gray-500";
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="rankings" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="rankings">
            {language === "ka" ? "პოზიციები" : "Rankings"}
          </TabsTrigger>
          <TabsTrigger value="trends">
            {language === "ka" ? "დინამიკა" : "Trends"}
          </TabsTrigger>
          <TabsTrigger value="report">
            {language === "ka" ? "ანგარიში" : "Report"}
          </TabsTrigger>
        </TabsList>

        {/* Rankings Tab */}
        <TabsContent value="rankings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>
                {language === "ka"
                  ? "საკვანძო სიტყვების პოზიციები"
                  : "Keyword Rankings"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="border-b">
                    <tr>
                      <th className="text-left py-2 px-3">
                        {language === "ka" ? "საკვანძო სიტყვა" : "Keyword"}
                      </th>
                      <th className="text-left py-2 px-3">
                        {language === "ka"
                          ? "საკვანძო სიტყვა (ქართულად)"
                          : "Keyword (KA)"}
                      </th>
                      <th className="text-center py-2 px-3">
                        {language === "ka" ? "პოზიცია" : "Position"}
                      </th>
                      <th className="text-center py-2 px-3">
                        {language === "ka" ? "ჩვენებები" : "Impressions"}
                      </th>
                      <th className="text-center py-2 px-3">
                        {language === "ka" ? "დაწკაპუნებები" : "Clicks"}
                      </th>
                      <th className="text-center py-2 px-3">
                        {language === "ka" ? "CTR" : "CTR"}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {rankings && rankings.length > 0 ? (
                      rankings.map((ranking: any) => (
                        <tr
                          key={ranking.id}
                          className="border-b hover:bg-gray-50"
                        >
                          <td className="py-3 px-3">{ranking.keyword}</td>
                          <td className="py-3 px-3">{ranking.keywordKa}</td>
                          <td
                            className={`py-3 px-3 text-center font-semibold ${getPositionColor(
                              ranking.position
                            )}`}
                          >
                            {ranking.position ? `#${ranking.position}` : "N/A"}
                          </td>
                          <td className="py-3 px-3 text-center">
                            {ranking.impressions}
                          </td>
                          <td className="py-3 px-3 text-center">
                            {ranking.clicks}
                          </td>
                          <td className="py-3 px-3 text-center">
                            {ranking.ctr}%
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={6}
                          className="py-4 text-center text-gray-500"
                        >
                          {language === "ka"
                            ? "მონაცემები ჯერ არ არის"
                            : "No data yet"}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Trends Tab */}
        <TabsContent value="trends" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>
                {language === "ka" ? "პოზიციების დინამიკა" : "Ranking Trends"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {trends && trends.length > 0 ? (
                  trends.map((trend: any) => (
                    <div
                      key={trend.keyword}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div>
                        <p className="font-semibold">{trend.keyword}</p>
                        <p className="text-sm text-gray-600">
                          {trend.keywordKa}
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-sm text-gray-600">
                            {language === "ka" ? "დინამიკა" : "Change"}
                          </p>
                          <p className="font-semibold">
                            #{trend.oldPosition} → #{trend.newPosition}
                          </p>
                        </div>
                        {getTrendBadge(trend.trend)}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-500 py-4">
                    {language === "ka"
                      ? "დინამიკის მონაცემები ჯერ არ არის"
                      : "No trend data yet"}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Report Tab */}
        <TabsContent value="report" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>
                {language === "ka" ? "კვირის ანგარიში" : "Weekly Report"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {report ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm text-gray-600">
                        {language === "ka" ? "საკვანძო სიტყვები" : "Keywords"}
                      </p>
                      <p className="text-2xl font-bold">
                        {report.totalKeywords}
                      </p>
                    </div>
                    <div className="p-3 bg-green-50 rounded-lg">
                      <p className="text-sm text-gray-600">
                        {language === "ka" ? "Top 10" : "Top 10"}
                      </p>
                      <p className="text-2xl font-bold">
                        {report.keywordsInTop10}
                      </p>
                    </div>
                    <div className="p-3 bg-yellow-50 rounded-lg">
                      <p className="text-sm text-gray-600">
                        {language === "ka" ? "Top 20" : "Top 20"}
                      </p>
                      <p className="text-2xl font-bold">
                        {report.keywordsInTop20}
                      </p>
                    </div>
                    <div className="p-3 bg-purple-50 rounded-lg">
                      <p className="text-sm text-gray-600">
                        {language === "ka" ? "საშუალო CTR" : "Avg CTR"}
                      </p>
                      <p className="text-2xl font-bold">{report.averageCTR}%</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600">
                        {language === "ka" ? "ჩვენებები" : "Impressions"}
                      </p>
                      <p className="text-2xl font-bold">
                        {report.totalImpressions.toLocaleString()}
                      </p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600">
                        {language === "ka" ? "დაწკაპუნებები" : "Clicks"}
                      </p>
                      <p className="text-2xl font-bold">
                        {report.totalClicks.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="text-xs text-gray-500 pt-2">
                    {language === "ka" ? "შედგენილია: " : "Generated: "}
                    {new Date(report.generatedAt).toLocaleDateString()}
                  </div>
                </div>
              ) : (
                <p className="text-center text-gray-500 py-4">
                  {language === "ka"
                    ? "ანგარიშის მონაცემები ჯერ არ არის"
                    : "No report data yet"}
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
