import axios from "axios";


const http = axios.create({

    baseURL:"http://localhost:3000"

});


const API = {


    signup(data){

        return http.post("/signup", data);

    },


    login(data){

        return http.post("/login", data);

    },


    profile(token){

        return http.get("/profile", {

            headers:{
                Authorization:`Bearer ${token}`
            }

        });

    },


    getRecipes(user_id){

        return http.get(`/recipes/user/${user_id}`);

    },


    deleteRecipe(id){

        return http.delete(`/recipes/${id}`);

    },


    updateRecipe(id,data){

        return http.put(`/recipes/${id}`, data);

    }


};


export default API;