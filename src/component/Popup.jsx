import '../css/Popup.css'
import { useState } from "react";

export default function Popup({ name = "", content = "", open = false, onClose }) {
  if (!open) return null;

  return (
    <>     
      <div className="pu-overlay" onClick={onClose}>
        <div className="pu-card" onClick={(e) => e.stopPropagation()}>
          <button className="pu-close" onClick={onClose}>×</button>
          <h2 className="pu-title" dangerouslySetInnerHTML={{ __html: name }} />
          <p className="pu-content">{content}</p>
          <button className="pu-btn" onClick={onClose}>Got it</button>
        </div>
      </div>
    </>
  );
}
