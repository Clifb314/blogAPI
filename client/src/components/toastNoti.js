import React, { useState } from "react";

export default function Toast({ type, message, onClose }) {
  return (
    <div className={`toast type-${type}`}>
      <div className="toastMsg">
        <p>{message}</p>
        <button className="toastBtn" onClick={onClose}>
          X
        </button>
      </div>
    </div>
  );
}
