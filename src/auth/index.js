//isLoggedIn

export const isLoggedIn=()=>{
    if(localStorage.getItem("user")==null){
        return false;
    }
    else{
        return true;
    }
}
//doLogin
export const doLogin=(data,next)=>{
    localStorage.setItem("token", data.token);
    localStorage.setItem("role", data.role);
    localStorage.setItem("user", JSON.stringify(data));
    next();
}

//doLogout
export const doLogout=(next)=>{
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("user");
    next();
}
//get current user
export const getCurrentUser=()=>{
    if(isLoggedIn()){
        return JSON.parse(localStorage.getItem("data"))?.user;
    }
    else{
        undefined;
    }
}