import {
  LayoutDashboard,
  FileText,
  PlusCircle,
  BarChart3,
} from "lucide-react";

const Sidebar = () => {
  return (
    <aside
      className="
      hidden
      lg:flex
      fixed
      left-0
      top-0
      h-screen
      w-72
      bg-white
      border-r
      border-slate-200
      flex-col
    "
    >
      <div className="p-6 border-b">
        <h1
          className="
          text-2xl
          font-bold
          text-indigo-600
        "
        >
          JanSetu Bihar
        </h1>

        <p className="text-sm text-slate-500">
          Civic Intelligence Platform
        </p>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        <button className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-slate-100">
          <LayoutDashboard size={20} />
          Dashboard
        </button>

        <button className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-slate-100">
          <PlusCircle size={20} />
          New Complaint
        </button>

        <button className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-slate-100">
          <FileText size={20} />
          My Complaints
        </button>

        <button className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-slate-100">
          <BarChart3 size={20} />
          Analytics
        </button>
      </nav>
    </aside>
  );
};

export default Sidebar;