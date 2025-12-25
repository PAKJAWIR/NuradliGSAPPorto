import { createPortal } from "react-dom";

export default function PortalRoot({ children, containerId = "portal-root" }) {
  const container = document.getElementById(containerId);

  if (!container) return null; // tetap aman kalau div-nya lupa dibuat
  return createPortal(children, container);
}
