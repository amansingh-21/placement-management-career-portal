const StatusBadge = ({ status }) => {
  if (!status) {
    return null;
  }

  return (
    <span>
      {status}
    </span>
  );
};

export default StatusBadge;