import React, { useState } from "react";
import MoodSelector from "./MoodSelector";
import { moodCategories } from "../data/moodCategories";

const DiaryForm = ({ onSubmit, initialData, onCancel }) => {
  // 获取当前日期时间，并确保使用本地时间
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");

  const todayDate = `${year}-${month}-${day}`;
  const currentTime = `${hours}:${minutes}`;

  // 使用初始数据或默认值初始化表单
  const [formData, setFormData] = useState({
    date: initialData?.date || todayDate,
    time: initialData?.time || currentTime,
    category: initialData?.category || "",
    mood: initialData?.mood || "",
    customMood: initialData?.customMood || "",
    trigger: initialData?.trigger || "",
    physicalResponse: initialData?.physicalResponse || "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.category) {
      alert("请选择情绪类别");
      return;
    }

    // 确保使用本地时间
    const submitData = {
      ...formData,
      id: Date.now(),
      date: formData.date, // 使用表单中的日期
      time: formData.time, // 使用表单中的时间
    };

    onSubmit(submitData);

    // 重置表单时使用当前本地时间
    setFormData({
      date: todayDate,
      time: currentTime,
      category: "",
      mood: "",
      customMood: "",
      trigger: "",
      physicalResponse: "",
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-sm"
    >
      <h2 className="text-2xl font-bold mb-6">
        {initialData ? "编辑记录" : "记录今日心情"}
      </h2>

      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">选择情绪类别</label>
        <MoodSelector
          selected={formData.category}
          onSelect={(category) =>
            setFormData((prev) => ({ ...prev, category, mood: "" }))
          }
        />
      </div>

      {formData.category && formData.category !== "自定义" && (
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">具体情绪</label>
          <select
            value={formData.mood}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, mood: e.target.value }))
            }
            className="w-full p-2 border rounded-lg"
          >
            <option value="">请选择</option>
            {moodCategories[formData.category]?.moods.map((mood) => (
              <option key={mood} value={mood}>
                {mood}
              </option>
            ))}
          </select>
        </div>
      )}

      {formData.category === "自定义" && (
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">描述你的情绪</label>
          <input
            type="text"
            value={formData.customMood}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, customMood: e.target.value }))
            }
            className="w-full p-2 border rounded-lg"
            placeholder="例如：复杂、矛盾..."
          />
        </div>
      )}

      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">触发事件</label>
        <textarea
          value={formData.trigger}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, trigger: e.target.value }))
          }
          className="w-full p-2 border rounded-lg"
          rows="3"
          placeholder="是什么让你有这样的心情..."
        />
      </div>

      <div className="flex gap-4">
        <button
          type="submit"
          className="flex-1 bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition-colors"
        >
          {initialData ? "保存修改" : "保存记录"}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 bg-gray-100 text-gray-600 py-3 rounded-lg hover:bg-gray-200 transition-colors"
          >
            取消
          </button>
        )}
      </div>
    </form>
  );
};

export default DiaryForm;
