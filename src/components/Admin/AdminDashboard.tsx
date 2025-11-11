import { useState } from "react";
import { Sidebar } from "./SideBar";
import { Header } from "./Header";
import { UsersTable } from "./UsersTable";
import { TipsTable } from "./TipsTable";
import { TransactionsTable } from "./TransactionsTable";
import { RevenueCard } from "./RevenueCard";
import { AnalyticsGraph } from "./AnalyticsGraph";
import { TipManagement } from "./TipManagement";
import { Menu, X } from "lucide-react";

export const AdminDashboard = () => {
  const [activeSection, setActiveSection] = useState<"dashboard" | "users" | "Addtip" | "tips" | "transactions">("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Close sidebar when section changes (mobile only)
  const handleSectionChange = (section: typeof activeSection) => {
    setActiveSection(section);
    setIsSidebarOpen(false);
  };

  return (
    <div className="flex h-screen bg-gray-900 text-white overflow-hidden pt-16">
      {/* Mobile Menu Button - Below navbar */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="md:hidden fixed top-20 left-4 z-50 p-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition shadow-lg"
        aria-label="Toggle menu"
      >
        {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Slide in on mobile, always visible on desktop */}
      <div
        className={`
          fixed md:static inset-y-0 left-0 z-40
          transform transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
          w-64 flex-shrink-0
        `}
      >
        <Sidebar 
          activeSection={activeSection} 
          setActiveSection={handleSectionChange}
        />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <Header />

        {/* Main content with proper mobile padding */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4 sm:p-6 lg:p-8">
            {activeSection === "dashboard" && (
              <div className="space-y-6">
                {/* Dashboard Title - Mobile */}
                <h1 className="text-2xl sm:text-3xl font-bold mb-4 md:hidden">
                  Dashboard
                </h1>
                
                {/* Cards Grid - Responsive */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  <RevenueCard />
                  <AnalyticsGraph />
                </div>
              </div>
            )}
            
            {activeSection === "users" && (
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold mb-4 md:mb-6">
                  Users Management
                </h1>
                <div className="overflow-x-auto">
                  <UsersTable />
                </div>
              </div>
            )}
            
            {activeSection === "Addtip" && (
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold mb-4 md:mb-6">
                  Add New Tip
                </h1>
                <TipManagement />
              </div>
            )}
            
            {activeSection === "tips" && (
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold mb-4 md:mb-6">
                  Tips Management
                </h1>
                <div className="overflow-x-auto">
                  <TipsTable />
                </div>
              </div>
            )}
            
            {activeSection === "transactions" && (
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold mb-4 md:mb-6">
                  Transactions
                </h1>
                <div className="overflow-x-auto">
                  <TransactionsTable />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};