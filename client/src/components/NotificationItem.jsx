import { useMutation } from "@tanstack/react-query";
import { useNotifications } from "../context/NotificationContext.jsx";
import apiClient from "../services/apiClient.js";

export default function NotificationItem({ notification, onClose }) {
  const { dispatch } = useNotifications();

  const { mutate: markRead } = useMutation({
    mutationFn: (id) =>
      apiClient.patch(`/api/notifications/${id}/read`),

    // Optimistically mark the notification as read.
    onMutate: (id) => {
      dispatch({
        type: "MARK_READ",
        payload: id,
      });
    },

    // Reload notifications if the request fails.
    onError: (error) => {
      console.error("Mark read failed:", error);

      apiClient
        .get("/api/notifications")
        .then((res) => {
          dispatch({
            type: "LOAD_NOTIFICATIONS",
            payload: res.data,
          });
        })
        .catch((err) => {
          console.error("Notification rollback failed:", err);
        });
    },
  });

  function handleClick() {
    if (!notification.isRead) {
      markRead(notification.id);
    }

    onClose();
  }

  return (
    <li
      onClick={handleClick}
      style={{
        padding: "0.85rem 1rem",
        borderBottom: "1px solid #f3f4f6",
        cursor: "pointer",
        background: notification.isRead ? "#ffffff" : "#eff6ff",
        display: "flex",
        gap: "0.75rem",
        alignItems: "flex-start",
      }}
    >
      {!notification.isRead && (
        <span
          style={{
            marginTop: "6px",
            flexShrink: 0,
            width: "8px",
            height: "8px",
            borderRadius: "50%",
            background: "#3b82f6",
          }}
        />
      )}

      <div>
        <p style={{ margin: "0 0 4px", fontSize: "0.875rem" }}>
          {notification.message}
        </p>

        <time style={{ fontSize: "0.75rem", color: "#9ca3af" }}>
          {new Date(notification.createdAt).toLocaleString()}
        </time>
      </div>
    </li>
  );
}