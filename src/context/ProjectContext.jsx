import { createContext, useContext, useEffect, useState } from "react";

// ─────────────────────────────────────────────────────────────
// CONTEXT SETUP
// ─────────────────────────────────────────────────────────────
const ProjectContext = createContext(null);

export const ProjectProvider = ({ children }) => {  
  // ─────────────────────────────────────────────────────────────
  // DATA STATE
  // ─────────────────────────────────────────────────────────────
  const [projects, setProjects] = useState([]); // All projects data
  const [loading, setLoading] = useState(true); // Fetch status

  // ─────────────────────────────────────────────────────────────
  // DATA FETCH
  // ─────────────────────────────────────────────────────────────
  useEffect(() => {
    fetch("/assets/data/data.json")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch projects");
        return res.json();
      })
      .then((data) => {
        setProjects(data);
        setLoading(false);
      })
      .catch(console.error);
  }, []);

  // ─────────────────────────────────────────────────────────────
  // CONTROLLER STATE
  // ─────────────────────────────────────────────────────────────
  const [activeIndex, setActiveIndex] = useState(null); // Global selected index
  const [isProjectFullyLoaded, setIsProjectFullyLoaded] = useState(false); // Animation guard

  // ─────────────────────────────────────────────────────────────
  // DERIVED STATE
  // ─────────────────────────────────────────────────────────────
  const activeProject = activeIndex !== null ? projects[activeIndex] : null;

  // ─────────────────────────────────────────────────────────────
  // CONTEXT COMMANDS (GLOBAL TRIGGERS)
  // ─────────────────────────────────────────────────────────────
  const openProject = (index) => {
    setActiveIndex(index); // Open viewer with selected project
  };

  const closeProject = () => {
    setActiveIndex(null); // Close viewer & reset state
  };

  // ─────────────────────────────────────────────────────────────
  // PROVIDER
  // ─────────────────────────────────────────────────────────────
  return (
    <ProjectContext.Provider
      value={{
        // data
        projects,
        loading,

        // controller
        activeIndex,
        activeProject,
        isProjectFullyLoaded,
        setIsProjectFullyLoaded,

        // commands
        openProject,
        closeProject,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};

// ─────────────────────────────────────────────────────────────
// HOOK
// ─────────────────────────────────────────────────────────────
export const useProjects = () => {
  const ctx = useContext(ProjectContext);
  if (!ctx) {
    throw new Error("useProjects must be used within a ProjectProvider");
  }
  return ctx;
};
