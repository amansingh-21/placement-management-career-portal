import StudentProfile from "../models/StudentProfile.js";

const calculateProfileCompletion = (profile) => {
  let completed = 0;
  const total = 8;

  if (profile.degree) {
    completed++;
  }

  if (profile.graduationYear) {
    completed++;
  }

  if (
    profile.cgpa !== undefined &&
    profile.cgpa !== null
  ) {
    completed++;
  }

  if (
    profile.backlogs !== undefined &&
    profile.backlogs !== null
  ) {
    completed++;
  }

  if (
    profile.skills &&
    profile.skills.length > 0
  ) {
    completed++;
  }

  if (
    profile.projects &&
    profile.projects.length > 0
  ) {
    completed++;
  }

  if (
    profile.certifications &&
    profile.certifications.length > 0
  ) {
    completed++;
  }

  if (profile.resumePath) {
    completed++;
  }

  return Math.round((completed / total) * 100);
};

export const getMyProfile = async (userId) => {
  const profile = await StudentProfile.findOne({ userId });

  if (!profile) {
    return null;
  }

  profile.profileCompletion = calculateProfileCompletion(profile);

  return profile;
};

export const updateMyProfile = async (userId, data) => {
  if (data.cgpa !== undefined && (data.cgpa < 0 || data.cgpa > 10)) {
    throw Object.assign(
      new Error("CGPA must be between 0 and 10"),
      { statusCode: 400 }
    );
  }

  if (data.backlogs !== undefined && data.backlogs < 0) {
    throw Object.assign(
      new Error("Backlogs cannot be negative"),
      { statusCode: 400 }
    );
  }

  const profile = await StudentProfile.findOneAndUpdate(
    { userId },
    { $set: data },
    {
      new: true,
      upsert: true,
    }
  );

  profile.profileCompletion = calculateProfileCompletion(profile);

  await profile.save();

  return profile;
};

export const updateSkills = async (userId, skills) => {
  if (!Array.isArray(skills)) {
    throw Object.assign(
      new Error("Skills must be an array"),
      { statusCode: 400 }
    );
  }

  const cleanedSkills = skills
    .map((skill) => String(skill).trim())
    .filter((skill) => skill.length > 0);

  const profile = await StudentProfile.findOneAndUpdate(
    { userId },
    {
      $set: {
        skills: cleanedSkills,
      },
      $setOnInsert: {
        userId,
      },
    },
    {
      new: true,
      upsert: true,
      runValidators: true,
    }
  );

  profile.profileCompletion = calculateProfileCompletion(profile);

  await profile.save();

  return profile;
};

export const updateProjects = async (userId, projects) => {
  if (!Array.isArray(projects)) {
    throw Object.assign(
      new Error("Projects must be an array"),
      { statusCode: 400 }
    );
  }

  const cleanedProjects = projects.map((project) => {
    if (!project || typeof project !== "object") {
      throw Object.assign(
        new Error("Each project must be an object"),
        { statusCode: 400 }
      );
    }

    const title = String(project.title || "").trim();
    const description = String(
      project.description || ""
    ).trim();

    const technologies = Array.isArray(
      project.technologies
    )
      ? project.technologies
          .map((technology) =>
            String(technology).trim()
          )
          .filter(
            (technology) =>
              technology.length > 0
          )
      : [];

    if (!title) {
      throw Object.assign(
        new Error("Project title is required"),
        { statusCode: 400 }
      );
    }

    if (!description) {
      throw Object.assign(
        new Error("Project description is required"),
        { statusCode: 400 }
      );
    }

    return {
      title,
      description,
      technologies,
    };
  });

  const profile = await StudentProfile.findOneAndUpdate(
    { userId },
    {
      $set: {
        projects: cleanedProjects,
      },
      $setOnInsert: {
        userId,
      },
    },
    {
      new: true,
      upsert: true,
      runValidators: true,
    }
  );

  profile.profileCompletion =
    calculateProfileCompletion(profile);

  await profile.save();

  return profile;
};

export const updateCertifications = async (userId, certifications) => {
  if (!Array.isArray(certifications)) {
    throw Object.assign(
      new Error("Certifications must be an array"),
      { statusCode: 400 }
    );
  }

  const cleanedCertifications =
    certifications.map((certification) => {
      if (
        !certification ||
        typeof certification !== "object"
      ) {
        throw Object.assign(
          new Error(
            "Each certification must be an object"
          ),
          { statusCode: 400 }
        );
      }

      const name = String(
        certification.name || ""
      ).trim();

      const issuer = String(
        certification.issuer || ""
      ).trim();

      const year = Number(
        certification.year
      );

      if (!name) {
        throw Object.assign(
          new Error(
            "Certification name is required"
          ),
          { statusCode: 400 }
        );
      }

      if (!issuer) {
        throw Object.assign(
          new Error(
            "Certification issuer is required"
          ),
          { statusCode: 400 }
        );
      }

      if (
        !Number.isInteger(year) ||
        year < 1900 ||
        year > 2100
      ) {
        throw Object.assign(
          new Error(
            "Certification year must be between 1900 and 2100"
          ),
          { statusCode: 400 }
        );
      }

      return {
        name,
        issuer,
        year,
      };
    });

  const profile =
    await StudentProfile.findOneAndUpdate(
      { userId },
      {
        $set: {
          certifications:
            cleanedCertifications,
        },
        $setOnInsert: {
          userId,
        },
      },
      {
        new: true,
        upsert: true,
        runValidators: true,
      }
    );

  profile.profileCompletion =
    calculateProfileCompletion(profile);

  await profile.save();

  return profile;
};

export const saveResume = async (userId, filePath) => {
  const profile = await StudentProfile.findOneAndUpdate(
    { userId },
    { resumePath: filePath },
    {
      new: true,
      upsert: true,
    }
  );

  profile.profileCompletion = calculateProfileCompletion(profile);

  await profile.save();

  return profile;
};