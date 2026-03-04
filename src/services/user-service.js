// import axios from "axios";
import { myAxios } from "./helper";
export const signup=async(user)=>{
    return myAxios.post('/auth/register',user)
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
    return myAxios.post('/auth/login',loginDetail).then((response)=>response.data);
}

export const updloadImage =async (image,userId)=> {
    return myAxios.post(`/user/public/uploadImg/{id}`)
}

// Fetch all users (admin function)
export const getAllUsers = async () => {
    return myAxios.get('/user/findAll')
        .then((response) => {
            console.log('API Response:', response.data);
            // Extract data from ApiResponse wrapper
            return response.data.data || response.data;
        })
        .catch((error) => {
            console.error('API Error Details:', error.response);
            console.error('Request config:', error.config);
            throw error;
        });
}

// Delete user (admin function)
export const deleteUser = async (userId) => {
    return myAxios.delete(`/user/delete/${userId}`)
        .then((response) => {
            console.log('Delete response:', response.data);
            return response.data;
        });
}

// Update user status (admin function) - Currently using update endpoint
export const updateUserStatus = async (userId, status) => {
    return myAxios.patch(`/user/update`, { 
        status: status 
    })
    .then((response) => {
        return response.data;
    });
}