import React, { useState, useRef, useEffect } from "react";
import Toast from "./toastNoti";

export default function ToastContainer({ data, onClick, removeAll }) {
  //const listRef = useRef(null)
  const display = data.length > 0 ? data.map((toast) => (
    <Toast
      key={toast.id}
      message={toast.message}
      type={toast.type}
      onClose={() => onClick(toast.id)}
    />))
    : ''

  const btn = data.length > 1 ? <button className="closeAll" onClick={removeAll}>Close All</button>
  : ''


  return (
    data.length > 0 && (
      <div className="toast-list">
        {display}
        {btn}
      </div>
    )
  );
}
