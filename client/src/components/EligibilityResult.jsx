const EligibilityResult = ({ result }) => {
  if (!result) {
    return null;
  }

  return (
    <div className="card" style={{ marginTop: "var(--space-5)" }}>
      <div className="list-item-header">
        <h3>Eligibility Result</h3>

        <span className={`badge ${result.eligible ? "badge-success" : "badge-danger"}`}>
          {result.eligible ? "Eligible" : "Not Eligible"}
        </span>
      </div>

      {result.checks?.length > 0 && (
        <div style={{ marginTop: "var(--space-4)" }}>
          {result.checks.map((check, index) => (
            <div className="eligibility-check" key={index}>
              <span className={`eligibility-check-icon ${check.passed ? "pass" : "fail"}`}>
                {check.passed ? "✓" : "✕"}
              </span>

              <div>
                <p style={{ fontWeight: 600, color: "var(--text-primary)", marginBottom: 2 }}>
                  {check.name}
                </p>
                <p style={{ fontSize: 13 }}>{check.message}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {result.reasons?.length > 0 && (
        <div style={{ marginTop: "var(--space-4)" }}>
          <p className="field-label" style={{ marginBottom: "var(--space-2)" }}>
            Reasons
          </p>

          <ul style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
            {result.reasons.map((reason, index) => (
              <li key={index} style={{ fontSize: 13, color: "var(--text-secondary)" }}>
                • {reason}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default EligibilityResult;