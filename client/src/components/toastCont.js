import React, { useState, useRef, useEffect } from "react";
import Toast from "./toastNoti";

export default function ToastContainer({ data, onClick, removeAll }) {
  //const listRef = useRef(null)

  return (
    data.length > 0 && (
      <div className="toast-list">
        {data.map((toast) => (
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            onClose={() => onClick(toast.id)}
          />
        ))}
        <button onClick={removeAll}>Close All</button>
      </div>
    )
  );
}
