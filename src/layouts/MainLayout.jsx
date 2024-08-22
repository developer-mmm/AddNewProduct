// rrd imports
import { Outlet } from "react-router-dom";

// components
import { Navbar } from "../components";

function MainLayout() {
  return (
    <>
      <Navbar />
      <main className="site-container">
        <Outlet />
      </main>
    </>
  );
}

export default MainLayout;
