import { useNotifications } from "../context/NotificationContext.jsx";
import NotificationItem from "./NotificationItem.jsx";

export default function NotificationDropdown({ onClose }) {
  const { state, dispatch } = useNotifications();
  const { notifications } = state;

  function handleMarkAllRead() {
    dispatch({ type: "MARK_ALL_READ" });
  }

  return (
    <div
      style={{
        position: "absolute",
        top: "calc(100% + 8px)",
        right: 0,
        width: "360px",
        maxWidth: "90vw",
        background: "#fff",
        color: "#111827",
        border: "1px solid #e5e7eb",
        borderRadius: "12px",
        boxShadow: "0 10px 40px rgba(0,0,0,0.12)",
        zIndex: 50,
        maxHeight: "420px",
        overflowY: "auto",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "1rem",
          borderBottom: "1px solid #e5e7eb",
        }}
      >
        <h3 style={{ margin: 0 }}>Notifications</h3>

        <button
          onClick={handleMarkAllRead}
          style={{
            border: "none",
            background: "none",
            color: "#2563eb",
            cursor: "pointer",
            fontSize: "0.85rem",
          }}
        >
          Mark all as read
        </button>
      </div>

      {notifications.length === 0 ? (
        <p style={{ padding: "1rem", textAlign: "center" }}>
          No notifications yet.
        </p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {notifications.map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              onClose={onClose}
            />
          ))}
        </ul>
      )}
    </div>
  );
}