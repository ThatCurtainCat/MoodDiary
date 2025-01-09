import React, { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Cell,
  PieChart,
  Pie,
} from "recharts";
import { motion } from "framer-motion";

const MoodReport = ({ entries }) => {
  const [timeRange, setTimeRange] = useState("week"); // 'week', 'month', 'year'

  const moodColors = {
    开心: "#22c55e",
    不开心: "#eab308",
    生气: "#ef4444",
    自定义: "#94a3b8",
  };

  // 获取时间范围内的数据
  const getTimeRangeData = () => {
    const now = new Date();
    let startDate;

    switch (timeRange) {
      case "week":
        startDate = new Date(now.setDate(now.getDate() - 7));
        break;
      case "month":
        startDate = new Date(now.setMonth(now.getMonth() - 1));
        break;
      case "year":
        startDate = new Date(now.setFullYear(now.getFullYear() - 1));
        break;
      default:
        startDate = new Date(now.setDate(now.getDate() - 7));
    }

    return entries.filter((entry) => new Date(entry.date) >= startDate);
  };

  // 计算情绪分布
  const getMoodDistribution = (data) => {
    const distribution = {
      开心: 0,
      不开心: 0,
      生气: 0,
      自定义: 0,
    };

    data.forEach((entry) => {
      if (entry.category) {
        // 确保 category 存在
        distribution[entry.category]++;
      }
    });

    // 只返回有数量的情绪
    return Object.entries(distribution)
      .filter(([_, count]) => count > 0) // 过滤掉数量为 0 的情绪
      .map(([name, count]) => ({
        name,
        count,
        color: moodColors[name],
        percentage: ((count / data.length) * 100).toFixed(0) + "%", // 添加百分比
      }));
  };

  // 计算时段分布（早中晚）
  const getTimeDistribution = (data) => {
    const distribution = {
      "早上(5-12)": { 开心: 0, 不开心: 0, 生气: 0, 自定义: 0 },
      "下午(12-18)": { 开心: 0, 不开心: 0, 生气: 0, 自定义: 0 },
      "晚上(18-24)": { 开心: 0, 不开心: 0, 生气: 0, 自定义: 0 },
    };

    data.forEach((entry) => {
      const hour = parseInt(entry.time.split(":")[0], 10);
      let period;

      if (hour >= 5 && hour < 12) period = "早上(5-12)";
      else if (hour >= 12 && hour < 18) period = "下午(12-18)";
      else period = "晚上(18-24)";

      distribution[period][entry.category]++;
    });

    return Object.entries(distribution).map(([time, moods]) => ({
      time,
      ...moods,
    }));
  };

  const timeRangeData = getTimeRangeData();
  const moodDistribution = getMoodDistribution(timeRangeData);
  const timeDistribution = getTimeDistribution(timeRangeData);

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6">
      <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-8 space-y-4 sm:space-y-0">
          <h2 className="text-2xl font-bold">情绪报告</h2>
          <div className="flex flex-wrap gap-2 sm:gap-4">
            <button
              onClick={() => setTimeRange("week")}
              className={`px-4 py-2 rounded-lg transition-colors ${
                timeRange === "week"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              周报告
            </button>
            <button
              onClick={() => setTimeRange("month")}
              className={`px-4 py-2 rounded-lg ${
                timeRange === "month" ? "bg-blue-500 text-white" : "bg-gray-100"
              }`}
            >
              月报告
            </button>
            <button
              onClick={() => setTimeRange("year")}
              className={`px-4 py-2 rounded-lg ${
                timeRange === "year" ? "bg-blue-500 text-white" : "bg-gray-100"
              }`}
            >
              年报告
            </button>
          </div>
        </div>

        {/* 统计摘要 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8">
          <motion.div
            className="bg-gray-50 p-4 rounded-lg"
            whileHover={{ scale: 1.02 }}
          >
            <h3 className="text-lg font-medium mb-2">记录总数</h3>
            <p className="text-3xl font-bold">{timeRangeData.length}</p>
          </motion.div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-medium mb-2">主要情绪</h3>
            <p
              className="text-3xl font-bold"
              style={{
                color:
                  moodColors[
                    moodDistribution.reduce(
                      (a, b) => (a.count > b.count ? a : b),
                      { count: 0 }
                    ).name
                  ],
              }}
            >
              {moodDistribution.length > 0
                ? moodDistribution.reduce((a, b) => (a.count > b.count ? a : b))
                    .name
                : "暂无数据"}
            </p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-medium mb-2">记录最多时段</h3>
            <p className="text-3xl font-bold">
              {(timeDistribution.length > 0 &&
                timeDistribution.reduce((a, b) =>
                  Object.values(a).reduce((sum, val) => sum + val, 0) >
                  Object.values(b).reduce((sum, val) => sum + val, 0)
                    ? a
                    : b
                ).time) ||
                "暂无数据"}
            </p>
          </div>
        </div>

        {/* 情绪分布饼图 */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h3 className="text-lg font-medium mb-4">情绪分布</h3>
          <div className="h-[300px] sm:h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={moodDistribution}
                  dataKey="count"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label={({ name, percentage }) => `${name} ${percentage}`}
                >
                  {moodDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value, name) => [
                    `${((value / timeRangeData.length) * 100).toFixed(0)}%`,
                    name,
                  ]}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* 时段分布堆叠柱状图 */}
        <div>
          <h3 className="text-lg font-medium mb-4">时段分布</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={timeDistribution}>
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                {Object.entries(moodColors).map(([mood, color]) => (
                  <Bar
                    key={mood}
                    dataKey={mood}
                    stackId="a"
                    fill={color}
                    name={mood}
                  />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MoodReport;
