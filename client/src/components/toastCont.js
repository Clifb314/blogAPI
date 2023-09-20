import React, {useState, useRef, useEffect} from "react";
import Toast from "./toastNoti";


export default function ToastContainer({ data, removeToast }) {
    const listRef = useRef(null)

    return (
        data.length > 0 && (
        <div className="toast-list">
            {data.map(toast => (
                <Toast key={toast.id} message={toast.message} type={toast.type} onClose={() => removeToast(toast.id)} />
            ))}
        </div>)
    )
}