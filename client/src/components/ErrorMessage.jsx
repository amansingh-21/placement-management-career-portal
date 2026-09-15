const ErrorMessage = ({ message }) => {
  if (!message) {
    return null;
  }

  return (
    <div role="alert" className="alert alert-error">
      <p>{message}</p>
    </div>
  );
};

export default ErrorMessage;