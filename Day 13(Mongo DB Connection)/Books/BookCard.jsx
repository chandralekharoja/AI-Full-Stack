import { Link } from "react-router-dom";
import API from "../api/api";


function BookCard({book,refresh}){


const deleteBook=async()=>{

await API.deleteBook(book._id);

refresh();

}



return(

<div className="book-card">


<h2>{book.title}</h2>

<p>
Author : {book.author}
</p>


<p>
Genre : {book.genre}
</p>


<p>
Price : ₹{book.price}
</p>


<p>
Year : {book.publishedYear}
</p>



<Link to={`/edit/${book._id}`}>
<button>
Edit
</button>
</Link>


<button onClick={deleteBook}>
Delete
</button>



</div>


)

}


export default BookCard;