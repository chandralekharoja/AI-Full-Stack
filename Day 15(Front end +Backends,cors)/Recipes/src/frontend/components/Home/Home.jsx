import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../../api/api";

import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import SearchBar from "../searchBar/SearchBar";
import RecipeCard from "../RecipeCard/RecipeCard";
import Loading from "../Loading/Loading";
import Error from "../Error/Error";
import AddRecipeModal from "../AddRecipeModal/AddRecipeModal";
import EditRecipe from "../EditRecipe/EditRecipe";

import "./Home.css";


function Home() {

  const [recipes, setRecipes] = useState([]);

  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);
  const [showModal,setShowModal]=useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [deleteId, setDeleteId] = useState(null);
  const [editRecipe,setEditRecipe] = useState(null);

  const [error, setError] = useState("");
  const navigate = useNavigate();



  // Get all recipes
  const getRecipes = async () => {

    try {

      setLoading(true);


      const token = localStorage.getItem("token");


      const response = await API.getRecipes(token);


      setRecipes(response.data);

      setError("");


    } catch(err) {

      console.log(err);

      setRecipes([]);

      setError(
        "Something went wrong."
      );

    }


    setLoading(false);

  };





  // Search recipes
  const handleSearch = async()=>{


    try {


      if(search.trim() === ""){

        getRecipes();

        return;

      }



      setLoading(true);


      const token = localStorage.getItem("token");



      const response = await API.searchRecipes(
        search,
        token
      );



      setRecipes(response.data);


      if(response.data.length === 0){

        setError(
          "No recipes found."
        );

      }
      else{

        setError("");

      }



    }catch(err){

      console.log(err);

      setError(
        "Search failed."
      );

      setRecipes([]);

    }


    setLoading(false);

  };

  useEffect(()=>{

    getRecipes();

  },[]);

//delete recipes
const handleDelete = async(id)=>{

  setDeleteId(id);

};

const confirmDelete = async()=>{

  try{

    const token = localStorage.getItem("token");


    await API.deleteRecipe(
      deleteId,
      token
    );


    setRecipes(
      recipes.filter(
        item => item._id !== deleteId
      )
    );


    // close delete popup
    setDeleteId(null);


    // show success message
    setSuccessMessage("Recipe deleted successfully 🗑️");


    setTimeout(()=>{

      setSuccessMessage("");

    },3000);



  }catch(err){

    console.log(err);

  }

};

  return (

    <>

      <Header />


      <div className="home">


        <h1 className="title">

          Find Your Favorite Recipe 🍳

        </h1>




        <SearchBar

          search={search}

          setSearch={setSearch}

          onSearch={handleSearch}

        />





        {loading && <Loading />}





        {!loading && error &&

          <Error message={error}/>

        }





<div className="recipe-grid">


{/* Add Recipe Card First */}

<RecipeCard

showAddButton={true}

onAdd={()=>setShowModal(true)}

/>



{
  recipes.map((recipe)=>(

    <RecipeCard

      key={recipe._id}

      recipe={recipe}

      onDelete={handleDelete}
      onEdit={(data)=>setEditRecipe(data)}

    />

  ))
}


</div>


      </div>

{
showModal &&

<AddRecipeModal

closeModal={()=>setShowModal(false)}

refreshRecipes={getRecipes}

setSuccessMessage={setSuccessMessage}

/>

}
{
successMessage &&

<div className="success-popup">

{successMessage}

</div>

}

{
deleteId &&

<div className="delete-overlay">

  <div className="delete-popup">


    <h3>
      Delete Recipe?
    </h3>


    <p>
      Are you sure you want to delete this recipe?
    </p>


    <div className="delete-buttons">


      <button
      className="cancel-btn"
      onClick={()=>setDeleteId(null)}
      >
        Cancel
      </button>


      <button
      className="confirm-btn"
      onClick={confirmDelete}
      >
        Delete
      </button>


    </div>


  </div>

</div>

}

{
editRecipe &&

<EditRecipe

recipeData={editRecipe}

closeModal={()=>setEditRecipe(null)}

refreshRecipes={getRecipes}

/>

}


      <Footer />


    </>

  );

}


export default Home;