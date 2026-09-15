const STATUS_STYLES = {
  APPLIED: "badge-info",
  PENDING: "badge-warning",
  SHORTLISTED: "badge-info",
  INTERVIEW: "badge-accent",
  SCHEDULED: "badge-accent",
  SELECTED: "badge-success",
  PASSED: "badge-success",
  APPROVED: "badge-success",
  COMPLETED: "badge-success",
  REJECTED: "badge-danger",
  FAILED: "badge-danger",
  CANCELLED: "badge-danger",
};

const StatusBadge = ({ status }) => {
  if (!status) {
    return null;
  }

  const variant = STATUS_STYLES[status] || "badge-neutral";

  return <span className={`badge ${variant}`}>{status}</span>;
};

export default StatusBadge;