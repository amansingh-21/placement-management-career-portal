const CertificationCard = ({ certification, onRemove }) => {
  return (
    <div className="list-item">
      <div className="list-item-header">
        <h3>{certification.name}</h3>

        <button type="button" className="btn btn-outline btn-sm" onClick={() => onRemove(certification)}>
          Remove
        </button>
      </div>

      <div className="list-item-meta">
        <p>
          <strong>Issuer:</strong> {certification.issuer}
        </p>
        <p>
          <strong>Year:</strong> {certification.year}
        </p>
      </div>
    </div>
  );
};

export default CertificationCard;