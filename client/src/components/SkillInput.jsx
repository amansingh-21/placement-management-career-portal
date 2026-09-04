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
        (existingSkill) =>
          existingSkill.toLowerCase() ===
          trimmedSkill.toLowerCase()
      )
    ) {
      setSkill("");
      return;
    }

    onChange([...skills, trimmedSkill]);
    setSkill("");
  };

  const handleRemove = (skillToRemove) => {
    onChange(
      skills.filter(
        (existingSkill) =>
          existingSkill !== skillToRemove
      )
    );
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleAdd();
    }
  };

  return (
    <div>
      <label htmlFor="skill">
        Add Skill
      </label>

      <br />

      <input
        id="skill"
        type="text"
        value={skill}
        onChange={(event) =>
          setSkill(event.target.value)
        }
        onKeyDown={handleKeyDown}
        placeholder="e.g. JavaScript"
      />

      <button
        type="button"
        onClick={handleAdd}
      >
        Add Skill
      </button>

      <br />
      <br />

      {skills.length === 0 ? (
        <p>No skills added yet.</p>
      ) : (
        <div>
          {skills.map((item) => (
            <span key={item}>
              {item}{" "}
              <button
                type="button"
                onClick={() => handleRemove(item)}
              >
                Remove
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default SkillInput;