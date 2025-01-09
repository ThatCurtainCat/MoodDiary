import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import DiaryForm from "./components/DiaryForm";
import Dashboard from "./components/Dashboard";
import MoodReport from "./components/MoodReport";
import { useLocalStorage } from "./hooks/useLocalStorage";

function App() {
  const [entries, setEntries] = useLocalStorage("diary-entries", []);
  const [showForm, setShowForm] = useState(false);
  const [editingEntry, setEditingEntry] = useState(null);
  const [currentView, setCurrentView] = useState("dashboard"); // 'dashboard' or 'report'

  const handleSubmit = (entry) => {
    if (editingEntry) {
      setEntries(
        entries.map((e) =>
          e.id === editingEntry.id ? { ...entry, id: editingEntry.id } : e
        )
      );
      setEditingEntry(null);
    } else {
      const newEntry = {
        ...entry,
        id: Date.now(),
      };
      setEntries([...entries, newEntry]);
    }
    setShowForm(false);
  };

  const handleDelete = (id) => {
    setEntries(entries.filter((entry) => entry.id !== id));
  };

  const handleEdit = (entry) => {
    setEditingEntry(entry);
    setShowForm(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {showForm ? (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            <DiaryForm
              onSubmit={handleSubmit}
              initialData={editingEntry}
              onCancel={() => {
                setShowForm(false);
                setEditingEntry(null);
              }}
            />
          </motion.div>
        </AnimatePresence>
      ) : (
        <div>
          <nav className="bg-white shadow-sm mb-6">
            <div className="max-w-4xl mx-auto px-4">
              <div className="flex justify-between h-16">
                <div className="flex space-x-4 items-center">
                  <button
                    onClick={() => setCurrentView("dashboard")}
                    className={`px-3 py-2 rounded-md transition-colors ${
                      currentView === "dashboard"
                        ? "bg-blue-50 text-blue-600"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    日历视图
                  </button>
                  <button
                    onClick={() => setCurrentView("report")}
                    className={`px-3 py-2 rounded-md transition-colors ${
                      currentView === "report"
                        ? "bg-blue-50 text-blue-600"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    统计报告
                  </button>
                </div>
              </div>
            </div>
          </nav>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentView}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="px-4"
            >
              {currentView === "dashboard" ? (
                <Dashboard
                  entries={entries}
                  onDelete={handleDelete}
                  onEdit={handleEdit}
                />
              ) : (
                <MoodReport entries={entries} />
              )}
            </motion.div>
          </AnimatePresence>

          <motion.button
            onClick={() => {
              setEditingEntry(null);
              setShowForm(true);
            }}
            className="fixed bottom-6 right-6 bg-blue-500 text-white p-4 rounded-full shadow-lg hover:bg-blue-600 transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            记录心情
          </motion.button>
        </div>
      )}
    </div>
  );
}

export default App;
