export const checkEligibility = (
  profile,
  job
) => {
  const checks = [];
  const reasons = [];

  const pass = (
    name,
    message
  ) => {
    checks.push({
      name,
      passed: true,
      message,
    });
  };

  const fail = (
    name,
    message
  ) => {
    checks.push({
      name,
      passed: false,
      message,
    });

    reasons.push(message);
  };

  if (
    job.eligibility?.minCgpa != null
  ) {
    if (
      (profile.cgpa ?? -1) >=
      job.eligibility.minCgpa
    ) {
      pass(
        "CGPA",
        "CGPA requirement satisfied"
      );
    } else {
      fail(
        "CGPA",
        `CGPA must be at least ${job.eligibility.minCgpa}`
      );
    }
  }

  if (
    job.eligibility?.maxBacklogs != null
  ) {
    if (
      (profile.backlogs ?? Infinity) <=
      job.eligibility.maxBacklogs
    ) {
      pass(
        "Backlogs",
        "Backlog requirement satisfied"
      );
    } else {
      fail(
        "Backlogs",
        `Backlogs must be <= ${job.eligibility.maxBacklogs}`
      );
    }
  }

  if (
    job.eligibility?.degree
  ) {
    if (
      profile.degree ===
      job.eligibility.degree
    ) {
      pass(
        "Degree",
        "Degree requirement satisfied"
      );
    } else {
      fail(
        "Degree",
        `Required degree: ${job.eligibility.degree}`
      );
    }
  }

  if (
    job.eligibility?.graduationYear
  ) {
    if (
      profile.graduationYear ===
      job.eligibility.graduationYear
    ) {
      pass(
        "Graduation Year",
        "Graduation year requirement satisfied"
      );
    } else {
      fail(
        "Graduation Year",
        "Graduation year requirement not satisfied"
      );
    }
  }

  if (
    job.eligibility?.skills?.length
  ) {
    const studentSkills = new Set(
      (profile.skills || []).map(
        (skill) =>
          skill.trim().toLowerCase()
      )
    );

    const missing =
      job.eligibility.skills.filter(
        (skill) =>
          !studentSkills.has(
            skill.trim().toLowerCase()
          )
      );

    if (missing.length === 0) {
      pass(
        "Skills",
        "All required skills are present"
      );
    } else {
      fail(
        "Skills",
        `Missing skills: ${missing.join(", ")}`
      );
    }
  }

  return {
    eligible:
      reasons.length === 0,

    checks,

    reasons,
  };
};