import React from "react";
import { Smile, Frown, Angry, Plus, X, Trash2, Edit } from "lucide-react";

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

const MoodDetail = ({ entry, onClose, onDelete, onEdit }) => {
  if (!entry) return null;

  const Icon = moodIcons[entry.category];
  const colorClass = moodColors[entry.category];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl p-6 max-w-md w-full relative animate-fade-in">
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center gap-3">
            <div
              className={`p-2 rounded-full bg-opacity-10 ${colorClass.replace(
                "text-",
                "bg-"
              )}`}
            >
              {Icon && <Icon className={`w-8 h-8 ${colorClass}`} />}
            </div>
            <div>
              <h3 className="text-xl font-bold">{entry.date}</h3>
              <p className="text-gray-500">{entry.time}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => onEdit(entry)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <Edit className="w-5 h-5 text-gray-500" />
            </button>
            <button
              onClick={() => {
                if (window.confirm("确定要删除这条记录吗？")) {
                  onDelete(entry.id);
                }
              }}
              className="p-2 hover:bg-red-50 rounded-full transition-colors"
            >
              <Trash2 className="w-5 h-5 text-red-500" />
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <p className="text-sm text-gray-500 mb-1">当时的心情</p>
            <p className="text-lg font-medium">
              {entry.category} ·{" "}
              {entry.category === "自定义" ? entry.customMood : entry.mood}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500 mb-1">触发事件</p>
            <p className="text-lg bg-gray-50 p-4 rounded-lg">{entry.trigger}</p>
          </div>

          {entry.physicalResponse && (
            <div>
              <p className="text-sm text-gray-500 mb-1">身体反应</p>
              <p className="text-lg bg-gray-50 p-4 rounded-lg">
                {entry.physicalResponse}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MoodDetail;
