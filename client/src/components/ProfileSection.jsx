const ProfileSection = ({ title, children }) => {
  return (
    <section className="card section">
      <h2 className="section-title">{title}</h2>
      <div>{children}</div>
    </section>
  );
};

export default ProfileSection;