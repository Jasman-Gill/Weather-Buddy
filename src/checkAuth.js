import React from 'react';


const checkAuth = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
        return false;
    }
    // Here you can add more checks, like token validation
    return true;
}

export default checkAuth;