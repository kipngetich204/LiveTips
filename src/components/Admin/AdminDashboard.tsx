import  { useState } from "react";
import { Sidebar } from "./SideBar";
import { Header } from "./Header";
import { UsersTable } from "./UsersTable";
import { TipsTable } from "./TipsTable";
import { TransactionsTable } from "./TransactionsTable";
import { RevenueCard } from "./RevenueCard";
import { AnalyticsGraph } from "./AnalyticsGraph";
import { TipManagement } from "./TipManagement";

export const AdminDashboard = () => {
  const [activeSection, setActiveSection] = useState<"dashboard" | "users" | "Addtip" | "tips" | "transactions">("dashboard");

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      {/* Sidebar */}
      <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} />

      <div className="flex-1 flex flex-col">
        {/* Header */}
        <Header />

        {/* Main content */}
        <div className="p-6 overflow-y-auto flex-1">
          {activeSection === "dashboard" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <RevenueCard />
              <AnalyticsGraph />
            </div>
          )}
          {activeSection === "users" && <UsersTable />}
          {activeSection === "Addtip" && <TipManagement />}
          {activeSection === "tips" && <TipsTable />}
          {activeSection === "transactions" && <TransactionsTable />}
        </div>
      </div>
    </div>
  );
};
