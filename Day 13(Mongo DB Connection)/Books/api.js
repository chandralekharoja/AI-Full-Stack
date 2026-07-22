import axios from "axios";


const http = axios.create({
  baseURL:"http://localhost:3000"
});


export const API = {

  signup(data){
    return http.post("/signup",data);
  },


  login(data){
    return http.post("/login",data);
  },


  getBooks(){
    return http.get("/books");
  },


  addBook(data){
    return http.post("/books",data);
  },


  updateBook(id,data){
    return http.put(`/books/${id}`,data);
  },


  deleteBook(id){
    return http.delete(`/books/${id}`);
  }

};


export default API;