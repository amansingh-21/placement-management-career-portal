import { useEffect, useState } from "react";

import DashboardLayout from "../../components/DashboardLayout.jsx";
import api from "../../services/api.js";

const Notifications = () => {
  const [notifications, setNotifications] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(
        "/notifications"
      );

      setNotifications(
        response.data.notifications || []
      );
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to load notifications."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const markAsRead = async (
    notificationId
  ) => {
    try {
      await api.put(
        `/notifications/${notificationId}/read`
      );

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
        error.response?.data?.message ||
          "Unable to mark notification as read."
      );
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <h1>Notifications</h1>
        <p>Loading notifications...</p>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <h1>Notifications</h1>

      {error && <p>{error}</p>}

      {!error &&
        notifications.length === 0 && (
          <div>
            <p>No notifications yet.</p>
          </div>
        )}

      {!error &&
        notifications.length > 0 && (
          <div>
            {notifications.map(
              (notification) => (
                <div
                  key={notification._id}
                >
                  <hr />

                  <h2>
                    {notification.type}
                  </h2>

                  <p>
                    {notification.message}
                  </p>

                  <p>
                    {notification.createdAt
                      ? new Date(
                          notification.createdAt
                        ).toLocaleString()
                      : "Date unavailable"}
                  </p>

                  <p>
                    Status:{" "}
                    <strong>
                      {notification.isRead
                        ? "Read"
                        : "Unread"}
                    </strong>
                  </p>

                  {!notification.isRead && (
                    <button
                      type="button"
                      onClick={() =>
                        markAsRead(
                          notification._id
                        )
                      }
                    >
                      Mark as Read
                    </button>
                  )}
                </div>
              )
            )}
          </div>
        )}
    </DashboardLayout>
  );
};

export default Notifications;