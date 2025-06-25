import "./ProfileInfoSkeleton.css";

const ProfileInfoSkeleton = () => {
  return (
    <aside className="info-panel visible">
      <div className="info-panel__section center">
        <div className="skeleton avatar-skeleton shimmer" />
        <div
          className="skeleton text-skeleton shimmer"
          style={{ width: "60%" }}
        />
        <div
          className="skeleton text-skeleton shimmer"
          style={{ width: "40%" }}
        />
      </div>

      <hr className="divider" />

      <div className="info-panel__section center status-block">
        <div className="skeleton circle-skeleton shimmer" />
        <div
          className="skeleton text-skeleton shimmer"
          style={{ width: "40%" }}
        />
      </div>

      <hr className="divider" />

      <div className="info-panel__section center">
        <div
          className="skeleton circle-skeleton shimmer"
          style={{ width: 48, height: 48 }}
        />
      </div>

      <hr className="divider" />

      <div className="info-panel__section">
        <h3 className="section-title">Groups in Common</h3>
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="skeleton text-skeleton shimmer"
            style={{ width: "80%", height: 20, marginBottom: 10 }}
          />
        ))}
      </div>
    </aside>
  );
};

export default ProfileInfoSkeleton;
