import { useProjects } from "../../context/ProjectContext";

function SelectedProjectssNew() {
  const { projects, openProject } = useProjects();

  const displayedProjects = projects.slice(0, 4);

  return (
    <section className="min-h-screen w-screen bg-warna1 my-16 px-8 ">
      {/* Title */}
      <div className="h-[60vh] flex justify-between w-full items-center ">
        <h1 className="flex uppercase font-black md:text-5xl lg:text-8xl ">Selected</h1>
        <h2 className="flex text-3xl font-bold">[{displayedProjects.length}]</h2>
        <h1 className="flex uppercase font-black md:text-5xl lg:text-8xl">Projects</h1>
      </div>

      {/* Projects */}
      <div className="grid grid-cols-2 md:gap-10 lg:gap-12 hidden">
        {displayedProjects.map((project, index) => (
          <div key={project.id} className="flex flex-col gap-6">
            {/* Image */}
            <div className="md:aspect-3/5 lg:aspect-1 w-full overflow-hidden cursor-pointer rounded-sm" onClick={() => openProject(index)}>
              <img src={project.image} alt={project.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
            </div>

            {/* Title */}
            <div className="flex justify-between items-center text-sm uppercase font-semibold">
              <h2 className="text-2xl font-bold">{project.title}</h2>

              <span className="text-2xl">[0{index + 1}]</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default SelectedProjectssNew;
