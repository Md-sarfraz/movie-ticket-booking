import { clearAuthStorage, getStoredAuth, setStoredAuth } from './storage';

//isLoggedIn

export const isLoggedIn=()=>{
    const { token, user } = getStoredAuth();
    return !!token && !!user;
}
//doLogin
export const doLogin=(data,next)=>{
    setStoredAuth({ token: data.token, role: data.role, user: data });
    next();
}

//doLogout
export const doLogout=(next)=>{
    clearAuthStorage();
    next();
}
//get current user
export const getCurrentUser=()=>{
    const { user } = getStoredAuth();
    return user;
}