import React from "react";

export default function authHeader() {
    const user = JSON.parse(localStorage.getItem('user'))

    if (user && user.token) {
        return {  'x-access-token': user.token, Authorization: `Bearer ${user.token}` }
    } else return {}
}