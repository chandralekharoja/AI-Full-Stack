import { useState } from "react";
import API from "../../../api/api";
import "./AddRecipeModal.css";


function AddRecipeModal({ closeModal, refreshRecipes, setSuccessMessage }) {


  const [recipe, setRecipe] = useState({

    name:"",
    category:"",
    cuisine:"",
    image:"",
    ingredients:"",
    instructions:"",
    prepTime:"",
    cookTime:"",
    servings:"",
    difficulty:"Easy"

  });



  const handleChange=(e)=>{

    setRecipe({

      ...recipe,

      [e.target.name]:e.target.value

    });

  };



  const handleSubmit=async(e)=>{

    e.preventDefault();


    try{

      const token = localStorage.getItem("token");


      await API.addRecipe(

        {
          ...recipe,

          ingredients: recipe.ingredients.split(","),

          instructions: recipe.instructions.split(","),

          servings:Number(recipe.servings)

        },

        token

      );

refreshRecipes();

closeModal();

setSuccessMessage("Recipe Added Successfully 🎉");


setTimeout(()=>{

setSuccessMessage("");

},3000);



    }catch(err){

      console.log(err);

    }

  };



return(

<div className="modal-overlay">


<div className="modal-box">


<h2>
Add Recipe
</h2>


<form onSubmit={handleSubmit}>


<input
name="name"
placeholder="Recipe Name"
onChange={handleChange}
/>



<input
name="category"
placeholder="Category"
onChange={handleChange}
/>



<input
name="cuisine"
placeholder="Cuisine"
onChange={handleChange}
/>



<input
name="image"
placeholder="Image URL"
onChange={handleChange}
/>



<textarea
name="ingredients"
placeholder="Ingredients separated by comma"
onChange={handleChange}
/>



<textarea
name="instructions"
placeholder="Instructions separated by comma"
onChange={handleChange}
/>



<input
name="prepTime"
placeholder="Prep Time"
onChange={handleChange}
/>



<input
name="cookTime"
placeholder="Cook Time"
onChange={handleChange}
/>



<input
name="servings"
placeholder="Servings"
onChange={handleChange}
/>



<select
name="difficulty"
onChange={handleChange}
>


<option>
Easy
</option>

<option>
Medium
</option>

<option>
Hard
</option>


</select>



<div className="modal-buttons">


<button type="submit">
Save
</button>


<button
type="button"
onClick={closeModal}
>
Cancel
</button>


</div>


</form>


</div>


</div>

)


}


export default AddRecipeModal;