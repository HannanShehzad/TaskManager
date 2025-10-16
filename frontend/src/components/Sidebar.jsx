import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { Home, User, Settings, Menu, CheckSquare } from "lucide-react";
import { useStyleContext } from "../context/StyleContext";
const items = [
  { to: "/home", label: "Home", icon: Home },
  { to: "/tasks", label: "Tasks", icon: Menu },

];

const Sidebar = () => {
  const { expanded, setExpanded } = useStyleContext(); // desktop expanded state
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handler = () => {
      setIsMobile(window.innerWidth < 768);
      // default collapse on mobile
      if (window.innerWidth < 768) setExpanded(false);
      else setExpanded(true);
    };

    handler();
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);

  return (
    <aside
      className={`bg-white  shadow-sm transition-all duration-200 flex flex-col ${
        expanded ? "w-56" : "w-16"
      }`}
      aria-hidden={!expanded && isMobile}
    >
      <div className="flex items-center p-4 h-18 bg-white border-b border-gray-300">
 
        <div className="flex items-center ml-2">
          <CheckSquare size={24} className="text-indigo-600" />
          {expanded && !isMobile && (
            <span className="ml-2 font-semibold text-gray-800 text-lg">
              TaskMaster
            </span>
          )}
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto mt-2">
        {items.map((it) => {
          const Icon = it.icon;
          return (
            <NavLink
              key={it.to}
              to={it.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 mx-2 rounded-md hover:bg-indigo-50 transition-colors ${
                  isActive ? "bg-indigo-100 text-indigo-700" : "text-gray-700"
                }`
              }
            >
              <Icon size={18} />
              {/* only show labels when expanded and not mobile */}
              {expanded && !isMobile && (
                <span className="font-medium">{it.label}</span>
              )}
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;
