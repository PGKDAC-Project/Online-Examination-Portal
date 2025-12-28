import { createContext, useContext, useEffect, useState } from "react";

const InstructorLayoutContext = createContext();

export const InstructorLayoutProvider = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [theme, setTheme] = useState(() => {
    const storedTheme = localStorage.getItem("theme");
    return storedTheme ? storedTheme : "light";
  });

  const toggleSidebar = () => setSidebarOpen(prev => !prev);

  const changeTheme = (mode) => {
    setTheme(mode);
  };

  useEffect(() => {
    document.body.className = theme;
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <InstructorLayoutContext.Provider
      value={{ sidebarOpen, toggleSidebar, theme, changeTheme }}
    >
      {children}
    </InstructorLayoutContext.Provider>
  );
};

export const useInstructorLayout = () =>
  useContext(InstructorLayoutContext);
