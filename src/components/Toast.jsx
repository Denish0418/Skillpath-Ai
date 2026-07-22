import { useEffect } from "react";

/**
 * Reusable Toast Notification Component
 * @param {Object} props
 * @param {boolean} props.show - Controls visibility
 * @param {string} props.message - Message to display
 * @param {'success'|'danger'|'warning'|'info'} props.type - Toast variant type
 * @param {Function} props.onClose - Callback on close
 * @param {number} [props.duration=4000] - Auto hide duration in ms
 */
function Toast({ show, message, type = "info", onClose, duration = 4000 }) {
    useEffect(() => {
        if (show && duration > 0) {
            const timer = setTimeout(() => {
                onClose();
            }, duration);
            return () => clearTimeout(timer);
        }
    }, [show, duration, onClose]);

    if (!show || !message) return null;

    // Icon based on type
    const getIcon = () => {
        switch (type) {
            case "success": return "bi-check-circle-fill";
            case "danger": return "bi-exclamation-triangle-fill";
            case "warning": return "bi-exclamation-circle-fill";
            default: return "bi-info-circle-fill";
        }
    };

    return (
        <div
            className="toast-container position-fixed top-0 end-0 p-3"
            style={{ zIndex: 9999, marginTop: "70px" }}
            aria-live="polite"
            aria-atomic="true"
        >
            <div
                className={`toast show align-items-center text-white bg-${type} border-0 shadow-lg animate-slide-down`}
                role="alert"
                aria-live="assertive"
                aria-atomic="true"
                style={{ borderRadius: "12px", minWidth: "300px" }}
            >
                <div className="d-flex p-2 align-items-center">
                    <div className="toast-body d-flex align-items-center gap-2 fs-6">
                        <i className={`bi ${getIcon()} fs-5`}></i>
                        <span>{message}</span>
                    </div>
                    <button
                        type="button"
                        className="btn-close btn-close-white me-2 m-auto"
                        aria-label="Close notification"
                        onClick={onClose}
                    ></button>
                </div>
            </div>
        </div>
    );
}

export default Toast;
