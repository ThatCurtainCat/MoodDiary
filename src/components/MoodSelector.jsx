import React from "react";
import { Smile, Frown, Angry, Plus } from "lucide-react";

const icons = {
  开心: Smile,
  不开心: Frown,
  生气: Angry,
  自定义: Plus,
};

const MoodSelector = ({ selected, onSelect }) => {
  return (
    <div className="grid grid-cols-4 gap-4 mb-6">
      {Object.entries(icons).map(([category, Icon]) => (
        <button
          key={category}
          type="button"
          onClick={() => onSelect(category)}
          className={`p-4 rounded-lg flex flex-col items-center justify-center gap-2 transition-all
            ${
              selected === category
                ? "bg-blue-100 border-2 border-blue-500"
                : "bg-gray-50 hover:bg-gray-100"
            }`}
        >
          <Icon
            className={`w-8 h-8 ${
              selected === category ? "text-blue-500" : "text-gray-600"
            }`}
          />
          <span className="text-sm">{category}</span>
        </button>
      ))}
    </div>
  );
};

export default MoodSelector;
