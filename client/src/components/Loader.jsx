const Loader = ({ message = "Loading..." }) => {
  return (
    <div className="loading-state">
      <span className="loading-spinner" />
      <p>{message}</p>
    </div>
  );
};

export default Loader;