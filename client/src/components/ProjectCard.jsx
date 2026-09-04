const ProjectCard = ({
  project,
  onRemove,
}) => {
  return (
    <div>
      <h3>{project.title}</h3>

      <p>{project.description}</p>

      {project.technologies &&
        project.technologies.length > 0 && (
          <div>
            <strong>Technologies:</strong>

            <ul>
              {project.technologies.map(
                (technology) => (
                  <li key={technology}>
                    {technology}
                  </li>
                )
              )}
            </ul>
          </div>
        )}

      <button
        type="button"
        onClick={() => onRemove(project)}
      >
        Remove
      </button>
    </div>
  );
};

export default ProjectCard;