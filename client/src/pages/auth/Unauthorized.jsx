import { Link } from "react-router-dom";

const Unauthorized = () => {
  return (
    <div className="state-page">
      <div className="state-page-inner">
        <h1>Access denied</h1>
        <p>You do not have permission to access this page.</p>
        <Link to="/login" className="btn btn-primary">
          Back to login
        </Link>
      </div>
    </div>
  );
};

export default Unauthorized;