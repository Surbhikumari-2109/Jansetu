import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

const MainLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar />

      <div className="lg:ml-72">
        <Topbar />

        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;