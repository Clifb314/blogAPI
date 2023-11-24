import ToastContainer from "./toastCont";
import React, { useState } from "react";





export default function ToastControl() {

    const [noti, setNoti] = useState([])


    function clearNoti() {
        setNoti([]);
        //noti.current = []
      }
    
      function removeNoti(id) {
        setNoti((prev) => prev.filter((toast) => toast.id !== id));
        //noti.current = noti.current.filter(toast => toast.id !== id)
      }
    
      function newNoti(type, message) {
        const myNoti = {
          id: uuidv4(),
          type,
          message,
        };
        setNoti([...noti, myNoti]);
        //noti.current = [...noti.current, myNoti]
        setTimeout(() => removeNoti(myNoti.id), 50000);
      }
    
    return (
        <ToastContainer data={noti} onClick={removeNoti} removeAll={clearNoti} />
    )  
}