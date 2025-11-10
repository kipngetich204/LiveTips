interface SidebarProps {
  activeSection: string;
  setActiveSection: (section: any) => void;
}

export const Sidebar = ({ activeSection, setActiveSection }: SidebarProps) => {
  const links = [
    { label: "Dashboard", key: "dashboard" },
    { label: "Users", key: "users" },
    { label: "Add Tip", key: "Addtip" },
    { label: "Tips", key: "tips" },
    { label: "Transactions", key: "transactions" },
  ];

  return (
    <div className="w-64 bg-gray-800 flex flex-col p-6">
      <h1 className="text-yellow-400 text-2xl font-bold mb-6">Admin Panel</h1>
      <ul className="space-y-2 flex-1">
        {links.map((link) => (
          <li
            key={link.key}
            className={`cursor-pointer p-2 rounded hover:bg-yellow-400 hover:text-black transition ${
              activeSection === link.key ? "bg-yellow-400 text-black font-semibold" : ""
            }`}
            onClick={() => setActiveSection(link.key)}
          >
            {link.label}
          </li>
        ))}
      </ul>
    </div>
  );
};
