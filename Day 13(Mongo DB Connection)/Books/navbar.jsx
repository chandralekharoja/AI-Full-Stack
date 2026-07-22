import { Link } from "react-router-dom";


function Navbar(){

return(

<nav>

<h2>📚 Book Store</h2>

<Link to="/books">
Books
</Link>


<Link to="/add-book">
Add Book
</Link>


<Link to="/">
Login
</Link>


<Link to="/signup">
Signup
</Link>


</nav>

)

}

export default Navbar;