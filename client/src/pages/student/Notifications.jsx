import { useEffect, useState } from "react";

import DashboardLayout from "../../components/DashboardLayout.jsx";
import Loader from "../../components/Loader.jsx";
import ErrorMessage from "../../components/ErrorMessage.jsx";
import api from "../../services/api.js";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/notifications");

      setNotifications(response.data.notifications || []);
    } catch (error) {
      setError(
        error.response?.data?.message || "Unable to load notifications."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const markAsRead = async (notificationId) => {
    try {
      await api.put(`/notifications/${notificationId}/read`);

      setNotifications((current) =>
        current.map((notification) =>
          notification._id === notificationId
            ? {
                ...notification,
                isRead: true,
              }
            : notification
        )
      );
    } catch (error) {
      setError(
        error.response?.data?.message || "Unable to mark notification as read."
      );
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="page-header">
          <h1>Notifications</h1>
        </div>

        <Loader message="Loading notifications..." />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="page-header">
        <h1>Notifications</h1>
        <p>Updates about your applications and interviews.</p>
      </div>

      <ErrorMessage message={error} />

      {!error && notifications.length === 0 && (
        <div className="empty-state">
          <h3>No notifications yet</h3>
          <p>You'll be notified here when something changes.</p>
        </div>
      )}

      {!error && notifications.length > 0 && (
        <div className="list-stack">
          {notifications.map((notification) => (
            <div
              className="list-item"
              key={notification._id}
              style={
                notification.isRead
                  ? undefined
                  : { borderLeft: "3px solid var(--color-accent)" }
              }
            >
              <div className="list-item-header">
                <h2>{notification.type}</h2>

                <span className={`badge ${notification.isRead ? "badge-neutral" : "badge-info"}`}>
                  {notification.isRead ? "Read" : "Unread"}
                </span>
              </div>

              <p>{notification.message}</p>

              <div className="list-item-meta" style={{ marginTop: "var(--space-3)", marginBottom: 0 }}>
                <span>
                  {notification.createdAt
                    ? new Date(notification.createdAt).toLocaleString()
                    : "Date unavailable"}
                </span>
              </div>

              {!notification.isRead && (
                <div className="list-item-footer">
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() => markAsRead(notification._id)}
                  >
                    Mark as Read
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
};

export default Notifications;