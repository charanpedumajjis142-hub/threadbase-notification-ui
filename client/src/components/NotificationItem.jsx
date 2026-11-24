import { useNotifications } from "../context/NotificationContext.jsx";
import apiClient from "../services/apiClient.js";

export default function NotificationItem({ notification }) {
  const { dispatch } = useNotifications();

  async function handleClick() {
    if (notification.isRead) return;

    // Update the UI immediately
    dispatch({
      type: "MARK_READ",
      payload: notification.id,
    });

    try {
      // Update the notification on the server
      await apiClient.patch(
        `/api/notifications/${notification.id}/read`
      );
    } catch (error) {
      console.error("Failed to mark as read:", error);

      // Reload notifications if the request fails
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
      onClick={handleClick}
      style={{
        padding: "1rem",
        borderBottom: "1px solid #e2e8f0",
        cursor: notification.isRead ? "default" : "pointer",
        background: notification.isRead ? "#fff" : "#eff6ff",
      }}
    >
      <p style={{ margin: 0 }}>
        {notification.message}
      </p>

      <small style={{ color: "#64748b" }}>
        {new Date(notification.createdAt).toLocaleString()}
      </small>

      {!notification.isRead && (
        <small
          style={{
            display: "block",
            color: "#2563eb",
            marginTop: "5px",
          }}
        >
          Unread
        </small>
      )}
    </div>
  );
}