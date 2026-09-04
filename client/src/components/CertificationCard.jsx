const CertificationCard = ({
  certification,
  onRemove,
}) => {
  return (
    <div>
      <h3>{certification.name}</h3>

      <p>
        <strong>Issuer:</strong>{" "}
        {certification.issuer}
      </p>

      <p>
        <strong>Year:</strong>{" "}
        {certification.year}
      </p>

      <button
        type="button"
        onClick={() =>
          onRemove(certification)
        }
      >
        Remove
      </button>
    </div>
  );
};

export default CertificationCard;