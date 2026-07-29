import "./Loader.css";

/**
 * Shared loading indicator.
 *
 * <Loader />                          block spinner, e.g. inside a tab/section
 * <Loader label="Loading slots..." /> block spinner with caption
 * <Loader fullScreen />               covers the viewport (route/auth loading)
 * <Loader inline size={14} />         tiny spinner to sit next to button text
 */
export default function Loader({ label, size = 22, fullScreen = false, inline = false }) {
  if (inline) {
    return (
      <span className="pp-loader pp-loader--inline" role="status" aria-label={label || "Loading"}>
        <span className="pp-loader__spin" style={{ width: size, height: size }} />
      </span>
    );
  }

  return (
    <div
      className={`pp-loader ${fullScreen ? "pp-loader--fullscreen" : ""}`}
      role="status"
      aria-live="polite"
      aria-label={label || "Loading"}
    >
      <span className="pp-loader__spin" style={{ width: size, height: size }} />
      {label && <span className="pp-loader__label">{label}</span>}
    </div>
  );
}
