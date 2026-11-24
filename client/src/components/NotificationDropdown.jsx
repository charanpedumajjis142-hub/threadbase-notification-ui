
import { useNotifications } from "../context/NotificationContext.jsx";
import apiClient from "../services/apiClient.js";
import NotificationItem from "./NotificationItem.jsx";

export default function NotificationDropdown({ onClose }) {
  const { state, dispatch } = useNotifications();
  const { notifications } = state;

  async function handleMarkAllRead() {
    const unreadNotifications = notifications.filter(
      (notification) => !notification.isRead
    );

    if (unreadNotifications.length === 0) return;

    // Update the UI immediately
    dispatch({ type: "MARK_ALL_READ" });

    try {
      // Mark each unread notification as read on the server
      await Promise.all(
        unreadNotifications.map((notification) =>
          apiClient.patch(
            `/api/notifications/${notification.id}/read`
          )
        )
      );
    } catch (error) {
      console.error("Failed to mark all as read:", error);

      // Reload notifications if an API request fails
      try {
        const res = await apiClient.get("/api/notifications");

        dispatch({
          type: "LOAD_NOTIFICATIONS",
          payload: res.data,
        });
      } catch (fetchError) {
        console.error("Failed to reload notifications:", fetchError);
      }
    }
  }

  return (
    <div
      style={{
        position: "absolute",
        right: 0,
        top: "2.5rem",
        width: "320px",
        maxHeight: "400px",
        overflowY: "auto",
        background: "#fff",
        color: "#1e293b",
        border: "1px solid #e2e8f0",
        borderRadius: "10px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          padding: "1rem",
          borderBottom: "1px solid #e2e8f0",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <strong>Notifications</strong>

        <button onClick={onClose}>Close</button>
      </div>

      {notifications.some((n) => !n.isRead) && (
        <button
          onClick={handleMarkAllRead}
          style={{
            margin: "0.75rem",
            padding: "0.5rem 0.75rem",
            cursor: "pointer",
          }}
        >
          Mark all as read
        </button>
      )}

      {notifications.length === 0 ? (
        <p style={{ padding: "1rem", color: "#64748b" }}>
          No notifications yet.
        </p>
      ) : (
        notifications.map((notification) => (
          <NotificationItem
            key={notification.id}
            notification={notification}
          />
        ))
      )}
    </div>
  );
}
