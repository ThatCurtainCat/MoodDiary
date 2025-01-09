import React, { useState } from "react";
import {
  Smile,
  Frown,
  Angry,
  Plus,
  ChevronLeft,
  ChevronRight,
  X,
  Edit,
  Trash2,
} from "lucide-react";
import MoodStats from "./MoodStats";

const moodIcons = {
  开心: Smile,
  不开心: Frown,
  生气: Angry,
  自定义: Plus,
};

const moodColors = {
  开心: "text-green-500",
  不开心: "text-yellow-500",
  生气: "text-red-500",
  自定义: "text-gray-500",
};

const MoodDetail = ({ entry, onClose }) => {
  if (!entry) return null;

  const Icon = moodIcons[entry.category];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl p-6 max-w-md w-full relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          {Icon && <Icon className="w-6 h-6" />}
          <h3 className="text-xl font-bold">
            {entry.date} {entry.time}
          </h3>
        </div>

        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-500">情绪</p>
            <p className="font-medium">
              {entry.category === "自定义" ? entry.customMood : entry.mood}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">触发事件</p>
            <p className="font-medium">{entry.trigger}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const Calendar = ({
  entries,
  currentDate,
  onPrevMonth,
  onNextMonth,
  onDelete,
  onEdit,
}) => {
  // 添加调试日志
  console.log("Calendar render - Current entries:", entries);
  console.log("Calendar render - Current date:", currentDate);

  const [selectedEntries, setSelectedEntries] = useState(null);

  // 获取当月天数
  const daysInMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  ).getDate();

  // 获取当月1号是星期几
  const firstDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  ).getDay();

  // 将日记条目按日期分组
  const entriesByDate = entries.reduce((acc, entry) => {
    const day = parseInt(entry.date.split("-")[2], 10);
    if (!acc[day]) {
      acc[day] = [];
    }
    acc[day].push(entry);
    return acc;
  }, {});

  console.log("Final entriesByDate mapping:", entriesByDate);

  const renderCalendarDays = () => {
    const days = [];

    // 添加空白格子
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="p-2"></div>);
    }

    // 添加日期格子
    for (let day = 1; day <= daysInMonth; day++) {
      const dayEntries = entriesByDate[day] || [];
      const hasEntries = dayEntries.length > 0;
      const today = new Date();
      const isToday =
        day === today.getDate() &&
        currentDate.getMonth() === today.getMonth() &&
        currentDate.getFullYear() === today.getFullYear();

      days.push(
        <div
          key={day}
          onClick={() => hasEntries && setSelectedEntries(dayEntries)}
          className={`p-2 relative cursor-pointer hover:bg-gray-50 transition-colors
            ${isToday ? "bg-blue-50 rounded-full" : ""}
            ${
              hasEntries ? "hover:scale-105 transform transition-transform" : ""
            }
          `}
        >
          <div className="text-center">
            {hasEntries && (
              <div className="relative inline-block">
                {/* 显示最新一条记录的心情图标 */}
                {(() => {
                  const latestEntry = dayEntries[dayEntries.length - 1];
                  const Icon = moodIcons[latestEntry.category];
                  return (
                    Icon && (
                      <Icon
                        className={`w-6 h-6 mx-auto mb-1 ${
                          latestEntry.category === "开心"
                            ? "text-green-500"
                            : latestEntry.category === "不开心"
                            ? "text-yellow-500"
                            : latestEntry.category === "生气"
                            ? "text-red-500"
                            : "text-gray-500"
                        }`}
                      />
                    )
                  );
                })()}
                {/* 如果有多条记录，显示记录数量 */}
                {dayEntries.length > 1 && (
                  <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                    {dayEntries.length}
                  </span>
                )}
              </div>
            )}
            <span
              className={`${isToday ? "font-bold" : ""} ${
                hasEntries ? "text-blue-600" : ""
              }`}
            >
              {day}
            </span>
          </div>
        </div>
      );
    }

    return days;
  };

  // 处理删除操作
  const handleDelete = async (id) => {
    if (window.confirm("确定要删除这条记录吗？")) {
      await onDelete(id); // 等待删除操作完成

      // 如果有选中的记录，更新选中的记录列表
      if (selectedEntries) {
        const updatedEntries = selectedEntries.filter(
          (entry) => entry.id !== id
        );
        if (updatedEntries.length === 0) {
          setSelectedEntries(null); // 如果没有记录了，关闭弹窗
        } else {
          setSelectedEntries(updatedEntries); // 更新显示的记录
        }
      }
    }
  };

  return (
    <>
      <div className="max-w-4xl mx-auto px-4">
        {/* 日历部分 */}
        <div
          id="calendar-container"
          className="bg-white rounded-xl shadow-sm p-6"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-medium">
              {currentDate.getFullYear()}年{currentDate.getMonth() + 1}月
            </h2>
            <div className="flex gap-4">
              <button
                onClick={onPrevMonth}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={onNextMonth}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* 使用 CSS Grid 布局，但确保只渲染一次表头 */}
          <div id="calendar-grid" className="grid grid-cols-7 gap-4">
            {/* 星期表头 */}
            {["日", "一", "二", "三", "四", "五", "六"].map((day) => (
              <div
                key={day}
                id={`calendar-header-${day}`}
                className="text-center text-gray-500 py-2"
              >
                {day}
              </div>
            ))}

            {/* 日期格子，从第二行开始 */}
            {renderCalendarDays().map((day, index) => (
              <div
                key={index}
                className="relative aspect-square flex items-center justify-center hover:bg-gray-50 rounded-lg transition-colors"
                style={{ gridRow: `${Math.floor(index / 7) + 2}` }} // 确保日期从第二行开始
              >
                <span className="text-gray-600">{day}</span>
                {/* 其他日历格子内容 */}
              </div>
            ))}
          </div>
        </div>

        {/* 统计部分 */}
        <div className="mt-6">
          <MoodStats
            entries={entries.filter((entry) =>
              entry.date.startsWith(
                `${currentDate.getFullYear()}-${String(
                  currentDate.getMonth() + 1
                ).padStart(2, "0")}`
              )
            )}
            currentDate={currentDate}
          />
        </div>
      </div>

      {/* 显示选中日期的所有记录 */}
      {selectedEntries && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl w-full max-w-2xl relative flex flex-col max-h-[90vh]">
            <div className="p-4 border-b sticky top-0 bg-white rounded-t-xl z-10 flex justify-between items-center">
              <h3 className="text-xl font-bold">
                {selectedEntries[0].date} 的记录 ({selectedEntries.length}条)
              </h3>
              <button
                onClick={() => setSelectedEntries(null)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 overflow-y-auto flex-1">
              <div className="space-y-4">
                {selectedEntries.map((entry) => (
                  <div key={entry.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        {(() => {
                          const Icon = moodIcons[entry.category];
                          return (
                            Icon && (
                              <Icon
                                className={`w-5 h-5 ${
                                  entry.category === "开心"
                                    ? "text-green-500"
                                    : entry.category === "不开心"
                                    ? "text-yellow-500"
                                    : entry.category === "生气"
                                    ? "text-red-500"
                                    : "text-gray-500"
                                }`}
                              />
                            )
                          );
                        })()}
                        <span className="font-medium">{entry.time}</span>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => onEdit(entry)}
                          className="p-2 hover:bg-gray-100 rounded-full"
                        >
                          <Edit className="w-4 h-4 text-gray-500" />
                        </button>
                        <button
                          onClick={() => handleDelete(entry.id)}
                          className="p-2 hover:bg-red-50 rounded-full"
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <p className="text-gray-600">
                        {entry.category === "自定义"
                          ? entry.customMood
                          : entry.mood}
                      </p>
                      <p className="text-gray-800">{entry.trigger}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const Dashboard = ({ entries, onDelete, onEdit }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const handlePrevMonth = () => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() - 1);
      return newDate;
    });
  };

  const handleNextMonth = () => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + 1);
      return newDate;
    });
  };

  // 过滤当月的记录
  const currentMonthEntries = entries.filter((entry) => {
    const entryDate = new Date(entry.date);
    return (
      entryDate.getMonth() === currentDate.getMonth() &&
      entryDate.getFullYear() === currentDate.getFullYear()
    );
  });

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <Calendar
          entries={currentMonthEntries}
          currentDate={currentDate}
          onPrevMonth={handlePrevMonth}
          onNextMonth={handleNextMonth}
          onDelete={onDelete}
          onEdit={onEdit}
        />
      </div>
    </div>
  );
};

export default Dashboard;
