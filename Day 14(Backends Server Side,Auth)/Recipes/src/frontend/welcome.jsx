import {useEffect,useState} from "react";
import API from "../api/api";
function Home(){
const [user,setUser]=useState("");
useEffect(()=>{
const token=localStorage.getItem("token");
API.profile(token)
.then(res=>{
setUser(res.data.user.username);
});
},[]);
return(
<div>
<h1>
Welcome {user} 🎉
</h1>
<p>
You are successfully logged in.
</p>
</div>
)
}


export default Home;