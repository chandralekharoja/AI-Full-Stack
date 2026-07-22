import { useEffect, useState } from "react";
import API from "../../../api/api";

import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import RecipeCard from "../RecipeCard/RecipeCard";
import Loading from "../Loading/Loading";
import Error from "../Error/Error";

import "./Categories.css";


function Categories() {

  const [categories, setCategories] = useState([]);

  const [selectedCategory, setSelectedCategory] = useState("");

  const [recipes, setRecipes] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");



  // Get Categories From Backend
  const getCategories = async () => {

    try {

      const token = localStorage.getItem("token");


      const response = await API.getCategories(token);


      console.log("Categories:", response.data);


      setCategories(response.data);


      // Load first category recipes
      if(response.data.length > 0){

        setSelectedCategory(response.data[0]);

        getRecipes(response.data[0]);

      }


    } catch(err){

      console.log(err);

      setError("Unable to load categories.");

    }

  };




  // Get Recipes By Category From Backend
  const getRecipes = async(category)=>{

    try{

      setLoading(true);


      const token = localStorage.getItem("token");


      const response = await API.getRecipesByCategory(
        category,
        token
      );


      console.log(
        "Category recipes:",
        response.data
      );


      setRecipes(response.data);

      setError("");


    }catch(err){

      console.log(err);

      setRecipes([]);

      setError(
        "Unable to load recipes."
      );

    }


    setLoading(false);

  };





  useEffect(()=>{

    getCategories();

  },[]);






  const handleCategory=(category)=>{

    setSelectedCategory(category);

    getRecipes(category);

  };





  return (

    <>

      <Header />


      <div className="category-page">


        <h1>
          Recipe Categories 🍽
        </h1>




        <div className="category-buttons">


          {
            categories.map((category,index)=>(


              <button

                key={index}

                onClick={()=>
                  handleCategory(category)
                }


                className={
                  selectedCategory === category
                  ?
                  "active"
                  :
                  ""
                }

              >

                {category}


              </button>


            ))
          }


        </div>





        {loading && <Loading />}





        {!loading && error && (

          <Error message={error}/>

        )}






        <div className="recipe-grid">


          {
            recipes.map((recipe)=>(


              <RecipeCard

                key={recipe._id}

                recipe={recipe}

              />


            ))
          }


        </div>



      </div>



      <Footer />

    </>

  );

}


export default Categories;