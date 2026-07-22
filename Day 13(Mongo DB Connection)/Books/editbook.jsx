import {useEffect,useState} from "react";
import {useParams,useNavigate} from "react-router-dom";
import API from "../../api/api";


function EditBook(){


const {id}=useParams();

const navigate=useNavigate();


const [book,setBook]=useState({});



useEffect(()=>{

API.getBook(id)
.then(res=>setBook(res.data));


},[]);



const update=async()=>{

await API.updateBook(id,book);


navigate("/books");


}



return(

<form>


<h1>Edit Book</h1>


{
Object.keys(book).map(key=>(

key!=="_id" &&
key!=="createdAt" &&
key!=="updatedAt" &&

<input

key={key}

value={book[key]}

onChange={(e)=>
setBook({
...book,
[key]:e.target.value
})
}

/>

))

}


<button onClick={update}>
Update
</button>


</form>


)

}


export default EditBook;