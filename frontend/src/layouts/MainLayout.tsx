import { Outlet, NavLink } from "react-router";

function MainLayout() {
  return (
    <div className="flex h-screen bg-zinc-950 text-white">
      <aside className="w-64 border-r border-zinc-800 p-6">
        <h2 className="mb-8 text-xl font-bold">
          My Application
        </h2>

        <nav className="flex flex-col gap-2">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `rounded-lg p-3 ${
                isActive
                  ? "bg-blue-600"
                  : "hover:bg-zinc-800"
              }`
            }
          >
            Home
          </NavLink>
        </nav>
      </aside>

      <main className="flex-1 overflow-auto p-8">
        <Outlet />
      </main>
    </div>
  );
}

export default MainLayout;