const ProjectCard = ({ project, onRemove }) => {
  return (
    <div className="list-item">
      <div className="list-item-header">
        <h3>{project.title}</h3>

        <button type="button" className="btn btn-outline btn-sm" onClick={() => onRemove(project)}>
          Remove
        </button>
      </div>

      <p>{project.description}</p>

      {project.technologies && project.technologies.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-2)", marginTop: "var(--space-3)" }}>
          {project.technologies.map((technology) => (
            <span key={technology} className="badge badge-neutral">
              {technology}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProjectCard;