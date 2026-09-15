import { useState } from "react";

const SkillInput = ({ skills, onChange }) => {
  const [skill, setSkill] = useState("");

  const handleAdd = () => {
    const trimmedSkill = skill.trim();

    if (!trimmedSkill) {
      return;
    }

    if (
      skills.some(
        (existingSkill) => existingSkill.toLowerCase() === trimmedSkill.toLowerCase()
      )
    ) {
      setSkill("");
      return;
    }

    onChange([...skills, trimmedSkill]);
    setSkill("");
  };

  const handleRemove = (skillToRemove) => {
    onChange(skills.filter((existingSkill) => existingSkill !== skillToRemove));
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleAdd();
    }
  };

  return (
    <div className="field">
      <label htmlFor="skill" className="field-label">
        Add Skill
      </label>

      <div style={{ display: "flex", gap: "var(--space-2)" }}>
        <input
          id="skill"
          type="text"
          className="input"
          value={skill}
          onChange={(event) => setSkill(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="e.g. JavaScript"
        />

        <button type="button" className="btn btn-secondary" onClick={handleAdd}>
          Add
        </button>
      </div>

      {skills.length === 0 ? (
        <p className="field-hint">No skills added yet.</p>
      ) : (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-2)", marginTop: "var(--space-1)" }}>
          {skills.map((item) => (
            <span key={item} className="chip">
              {item}
              <button type="button" onClick={() => handleRemove(item)} aria-label={`Remove ${item}`}>
                ✕
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default SkillInput;