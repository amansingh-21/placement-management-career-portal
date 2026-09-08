const EligibilityResult = ({ result }) => {
  if (!result) {
    return null;
  }

  return (
    <section>
      <h2>Eligibility Result</h2>

      <p>
        <strong>
          {result.eligible
            ? "Eligible"
            : "Not Eligible"}
        </strong>
      </p>

      {result.checks?.length > 0 && (
        <div>
          <h3>Eligibility Checks</h3>

          {result.checks.map(
            (check, index) => (
              <div key={index}>
                <p>
                  <strong>
                    {check.passed
                      ? "✓"
                      : "✗"}{" "}
                    {check.name}
                  </strong>
                </p>

                <p>
                  {check.message}
                </p>
              </div>
            )
          )}
        </div>
      )}

      {result.reasons?.length > 0 && (
        <div>
          <h3>Reasons</h3>

          <ul>
            {result.reasons.map(
              (reason, index) => (
                <li key={index}>
                  {reason}
                </li>
              )
            )}
          </ul>
        </div>
      )}
    </section>
  );
};

export default EligibilityResult;