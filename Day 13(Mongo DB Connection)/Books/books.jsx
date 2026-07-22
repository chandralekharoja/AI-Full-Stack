import {useEffect,useState} from "react";
import API from "../../api/api";
import BookCard from "../../components/BookCard";


function Books(){


const [books,setBooks]=useState([]);



const loadBooks=async()=>{

const res=await API.getBooks();

setBooks(res.data);

}



useEffect(()=>{

loadBooks();

},[]);



return(

<div>


<h1>
All Books
</h1>



<div>


{
books.map(book=>(

<BookCard
key={book._id}
book={book}
refresh={loadBooks}
/>


))

}


</div>


</div>


)

}


export default Books;