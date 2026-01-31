// import axios from "axios";
import { myAxios } from "./helper";
export const signup=async(user)=>{
    return myAxios.post('/api/auth/register',user)
    .then((response)=>response.data)
    // try{
    //     const response=await axios.post('http://localhost:9090/api/auth/register',user);
    //     console.log(response)
    //     if(response.status===201){
    //         return response.data
    //     }
    // }catch(error){
    //     console.log(error);
        
    // }
   
}
export const login=async(loginDetail)=>{
    return myAxios.post('api/auth/login',loginDetail).then((response)=>response.data);
}

export const updloadImage =async (image,userId)=> {
    return myAxios.post(`/api/user/public/uploadImg/{id}`)
}

// Fetch all users (admin function)
export const getAllUsers = async () => {
    return myAxios.get('/api/user/findAll')
        .then((response) => {
            console.log('API Response:', response.data);
            return response.data;
        })
        .catch((error) => {
            console.error('API Error Details:', error.response);
            console.error('Request config:', error.config);
            throw error;
        });
}

// Delete user (admin function)
export const deleteUser = async (userId) => {
    return myAxios.delete(`/api/user/${userId}`);
}

// Update user status (admin function)
export const updateUserStatus = async (userId, status) => {
    return myAxios.patch(`/api/user/${userId}/status`, { status });
}