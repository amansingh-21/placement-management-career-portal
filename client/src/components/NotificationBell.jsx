import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../services/api.js";

const NotificationBell = () => {
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const fetchNotifications = async () => {
    try {
      setLoading(true);

      const response = await api.get("/notifications");

      setNotifications(response.data.notifications || []);
    } catch (error) {
      console.error("Unable to load notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      fetchNotifications();
    }
  }, [open]);

  const unreadCount = notifications.filter(
    (notification) => !notification.isRead
  ).length;

  const handleNotificationClick = async (notification) => {
    try {
      if (!notification.isRead) {
        await api.put(`/notifications/${notification._id}/read`);

        setNotifications((current) =>
          current.map((item) =>
            item._id === notification._id ? { ...item, isRead: true } : item
          )
        );
      }
    } catch (error) {
      console.error("Unable to mark notification as read:", error);
    }
  };

  return (
    <div style={{ position: "relative" }}>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-label="Notifications"
        style={{
          position: "relative",
          width: 36,
          height: 36,
          borderRadius: "var(--radius-sm)",
          border: "1px solid var(--color-border)",
          background: "var(--color-surface)",
          cursor: "pointer",
          fontSize: 16,
        }}
      >
        🔔
        {unreadCount > 0 && (
          <span
            style={{
              position: "absolute",
              top: -4,
              right: -4,
              minWidth: 16,
              height: 16,
              padding: "0 4px",
              borderRadius: 999,
              background: "var(--color-error)",
              color: "#fff",
              fontSize: 10,
              fontWeight: 700,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              lineHeight: 1,
            }}
          >
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div
          style={{
            position: "absolute",
            top: 44,
            right: 0,
            width: 320,
            maxHeight: 400,
            overflowY: "auto",
            background: "var(--color-surface)",
            border: "1px solid var(--color-border)",
            borderRadius: "var(--radius-md)",
            boxShadow: "var(--shadow-md)",
            zIndex: 100,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "var(--space-4)",
              borderBottom: "1px solid var(--color-border)",
            }}
          >
            <strong style={{ fontSize: 14 }}>Notifications</strong>

            <button
              type="button"
              className="btn-ghost"
              onClick={() => {
                setOpen(false);
                navigate("/student/notifications");
              }}
            >
              View All
            </button>
          </div>

          {loading && (
            <p style={{ padding: "var(--space-4)", fontSize: 13, color: "var(--text-secondary)" }}>
              Loading notifications...
            </p>
          )}

          {!loading && notifications.length === 0 && (
            <p style={{ padding: "var(--space-4)", fontSize: 13, color: "var(--text-secondary)" }}>
              No notifications.
            </p>
          )}

          {!loading &&
            notifications.length > 0 &&
            notifications.slice(0, 5).map((notification) => (
              <button
                key={notification._id}
                type="button"
                onClick={() => handleNotificationClick(notification)}
                style={{
                  display: "block",
                  width: "100%",
                  textAlign: "left",
                  padding: "var(--space-4)",
                  borderBottom: "1px solid var(--color-border)",
                  background: notification.isRead ? "transparent" : "var(--color-primary-soft)",
                  border: "none",
                  borderBottomWidth: 1,
                  borderBottomStyle: "solid",
                  borderBottomColor: "var(--color-border)",
                  cursor: "pointer",
                }}
              >
                <strong style={{ fontSize: 13, display: "block", marginBottom: 4 }}>
                  {notification.type}
                </strong>

                <p style={{ fontSize: 13, margin: 0, color: "var(--text-secondary)" }}>
                  {notification.message}
                </p>

                <small style={{ fontSize: 11, color: "var(--text-muted)" }}>
                  {notification.createdAt
                    ? new Date(notification.createdAt).toLocaleString()
                    : ""}
                </small>

                {!notification.isRead && (
                  <span style={{ marginLeft: 6, fontSize: 11, color: "var(--color-primary)", fontWeight: 600 }}>
                    • Unread
                  </span>
                )}
              </button>
            ))}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;