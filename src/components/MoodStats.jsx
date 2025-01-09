import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  LineChart,
  Line,
} from "recharts";

const MoodStats = ({ entries, currentDate }) => {
  const moodColors = {
    开心: "#22c55e",
    不开心: "#eab308",
    生气: "#ef4444",
    自定义: "#94a3b8",
  };

  // 计算情绪分布
  const getMoodDistribution = () => {
    const distribution = entries.reduce(
      (acc, entry) => {
        if (entry.category) {
          acc[entry.category] = (acc[entry.category] || 0) + 1;
        }
        return acc;
      },
      {
        开心: 0, // 预设顺序
        不开心: 0,
        生气: 0,
        自定义: 0,
      }
    );

    return Object.entries(distribution).map(([name, value]) => ({
      name,
      value,
      color: moodColors[name],
    }));
  };

  // 计算情绪变化趋势
  const getMoodTrend = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;
    const daysInMonth = new Date(year, month, 0).getDate();

    // 按日期分组数据
    const entriesByDate = entries.reduce((acc, entry) => {
      const day = parseInt(entry.date.split("-")[2], 10);
      if (!acc[day]) {
        acc[day] = [];
      }
      acc[day].push(entry);
      return acc;
    }, {});

    // 初始化每天的数据
    return Array.from({ length: daysInMonth }, (_, index) => {
      const day = index + 1;
      const dayEntries = entriesByDate[day] || [];

      const counts = {
        开心: 0, // 预设顺序
        不开心: 0,
        生气: 0,
        自定义: 0,
      };

      dayEntries.forEach((entry) => {
        if (entry.category) {
          counts[entry.category]++;
        }
      });

      return {
        day: String(day),
        ...counts,
        total: dayEntries.length,
      };
    });
  };

  // 自定义 Tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const dayData = payload[0]?.payload; // 获取当天的完整数据
      const validPayload = payload.filter((item) => item.value > 0);

      return (
        <div className="bg-white p-2 border rounded shadow-lg">
          <p className="text-sm font-medium">{`${label}日`}</p>
          {validPayload.map((item) => (
            <p
              key={item.name}
              className="text-sm"
              style={{ color: item.stroke }}
            >
              {`${item.name}: ${item.value}`}
            </p>
          ))}
          <p className="text-sm text-gray-600 border-t mt-1 pt-1">
            {`总计: ${dayData.total || 0}条`}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-lg p-8">
      <h2 className="text-2xl font-medium mb-8">2025年1月情绪统计</h2>

      {/* 情绪分布 */}
      <div className="mb-12">
        <h3 className="text-lg font-medium mb-6 text-gray-700">情绪分布</h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={getMoodDistribution()}>
              <XAxis dataKey="name" axisLine={false} tickLine={false} />
              <YAxis axisLine={false} tickLine={false} gridLines={true} />
              <Tooltip
                cursor={false}
                contentStyle={{
                  backgroundColor: "white",
                  border: "none",
                  borderRadius: "8px",
                  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
                }}
              />
              <Bar dataKey="value" radius={[4, 4, 0, 0]} maxBarSize={60}>
                {getMoodDistribution().map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.color}
                    style={{ filter: "brightness(1.05)" }}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 情绪变化趋势 */}
      <div>
        <h3 className="text-lg font-medium mb-6 text-gray-700">情绪变化趋势</h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={getMoodTrend()}>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#f0f0f0"
              />
              <XAxis dataKey="day" axisLine={false} tickLine={false} />
              <YAxis allowDecimals={false} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              {Object.entries(moodColors).map(([mood, color]) => (
                <Line
                  key={mood}
                  type="monotone"
                  dataKey={mood}
                  stroke={color}
                  strokeWidth={2}
                  dot={{
                    fill: color,
                    strokeWidth: 0,
                    r: 4,
                  }}
                  activeDot={{
                    r: 6,
                    strokeWidth: 0,
                  }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* 图例 */}
        <div className="mt-6 flex flex-wrap gap-6 justify-center">
          {Object.entries(moodColors).map(([mood, color]) => (
            <div key={mood} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: color }}
              />
              <span className="text-sm text-gray-600">{mood}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MoodStats;
