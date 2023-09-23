import React, { useState, useRef, useEffect } from "react";
import Toast from "./toastNoti";

export default function ToastContainer({ data }) {
  //const listRef = useRef(null)
  const [toasts, setToasts] = useState([]);

  function removeToast(id) {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }

  function removeAll() {
    setToasts([]);
  }

  if (data) {
    //data must be an array of objects
    for (const toast in data) {
      setToasts((prev) => [...prev, toast]);
      setTimeout(() => removeToast(toast.id), 5000);
    }
  }

  //add auto delete, useEffect?

  return (
    toasts.length > 0 && (
      <div className="toast-list">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            onClose={() => removeToast(toast.id)}
          />
        ))}
        <button onClick={removeAll}>Close All</button>
      </div>
    )
  );
}
