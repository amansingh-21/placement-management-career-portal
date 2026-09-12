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

      const response = await api.get(
        "/notifications"
      );

      setNotifications(
        response.data.notifications || []
      );
    } catch (error) {
      console.error(
        "Unable to load notifications:",
        error
      );
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
    (notification) =>
      !notification.isRead
  ).length;

  const handleNotificationClick = async (
    notification
  ) => {
    try {
      if (!notification.isRead) {
        await api.put(
          `/notifications/${notification._id}/read`
        );

        setNotifications((current) =>
          current.map((item) =>
            item._id === notification._id
              ? {
                  ...item,
                  isRead: true,
                }
              : item
          )
        );
      }
    } catch (error) {
      console.error(
        "Unable to mark notification as read:",
        error
      );
    }
  };

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
      >
        🔔
        {unreadCount > 0 && (
          <span>
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div>
          <div>
            <strong>
              Notifications
            </strong>

            <button
              type="button"
              onClick={() =>
                navigate(
                  "/student/notifications"
                )
              }
            >
              View All
            </button>
          </div>

          {loading && (
            <p>Loading notifications...</p>
          )}

          {!loading &&
            notifications.length === 0 && (
              <p>No notifications.</p>
            )}

          {!loading &&
            notifications.length > 0 && (
              <div>
                {notifications
                  .slice(0, 5)
                  .map((notification) => (
                    <button
                      key={notification._id}
                      type="button"
                      onClick={() =>
                        handleNotificationClick(
                          notification
                        )
                      }
                    >
                      <strong>
                        {notification.type}
                      </strong>

                      <p>
                        {notification.message}
                      </p>

                      <small>
                        {notification.createdAt
                          ? new Date(
                              notification.createdAt
                            ).toLocaleString()
                          : ""}
                      </small>

                      {!notification.isRead && (
                        <span>
                          • Unread
                        </span>
                      )}
                    </button>
                  ))}
              </div>
            )}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;