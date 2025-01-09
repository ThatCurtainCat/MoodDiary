import React from "react";
import { Link, useLocation } from "react-router-dom";

const Layout = ({ children }) => {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <nav className="flex gap-4">
              <Link
                to="/"
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  location.pathname === "/"
                    ? "bg-gray-100 text-gray-900"
                    : "text-gray-500 hover:text-gray-900"
                }`}
              >
                日历视图
              </Link>
              <Link
                to="/stats"
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  location.pathname === "/stats"
                    ? "bg-gray-100 text-gray-900"
                    : "text-gray-500 hover:text-gray-900"
                }`}
              >
                统计报告
              </Link>
            </nav>
          </div>
        </div>
      </header>
      <main className="py-6">{children}</main>
    </div>
  );
};

export default Layout;
