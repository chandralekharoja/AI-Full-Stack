import {useState} from "react";
import API from "../../api/api";
import {useNavigate} from "react-router-dom";


function AddBook(){


const navigate=useNavigate();


const [book,setBook]=useState({
title:"",
author:"",
genre:"",
price:"",
publishedYear:""
});



const save=async(e)=>{

e.preventDefault();


await API.addBook(book);


navigate("/books");


}



return(

<form onSubmit={save}>


<h1>Add Book</h1>


{
Object.keys(book).map((key)=>(

<input

key={key}

placeholder={key}

onChange={(e)=>
setBook({
...book,
[key]:e.target.value
})
}

/>

))

}



<button>
Save
</button>


</form>


)

}


export default AddBook;