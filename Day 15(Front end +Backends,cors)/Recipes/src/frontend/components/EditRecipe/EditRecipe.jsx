import { useEffect, useState } from "react";

import API from "../../../api/api";

import "./EditRecipe.css";


function EditRecipe({
  recipeData,
  closeModal,
  refreshRecipes
}) {


const [recipe,setRecipe] = useState({

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


const [error,setError] = useState("");

const [success,setSuccess] = useState("");



// Load selected recipe data

useEffect(()=>{


if(recipeData){


setRecipe({

...recipeData,


ingredients:
recipeData.ingredients.join(","),


instructions:
recipeData.instructions.join(",")


});


}


},[recipeData]);




// input change

const handleChange=(e)=>{


setRecipe({

...recipe,

[e.target.name]:e.target.value

});


};




// update recipe

const handleSubmit = async(e)=>{


e.preventDefault();


setError("");

setSuccess("");



// validation

for(let field in recipe){


if(String(recipe[field]).trim()===""){


setError(
`${field} is required`
);


return;


}

}



try{


const token = localStorage.getItem("token");



await API.updateRecipe(

recipeData._id,


{


...recipe,


ingredients:

recipe.ingredients
.split(",")
.map(item=>item.trim()),



instructions:

recipe.instructions
.split(",")
.map(item=>item.trim()),



servings:Number(recipe.servings)


},


token

);




setSuccess(
"Recipe updated successfully 🎉"
);




setTimeout(()=>{


refreshRecipes();

closeModal();


},2000);



}

catch(err){


console.log(err);


setError(
"Update failed"
);


}



};





return(


<div className="edit-overlay">


<div className="edit-modal">



<h2>
Edit Recipe
</h2>




{
error &&

<div className="error-message">

{error}

</div>

}




{
success &&

<div className="success-message">

{success}

</div>

}





<form onSubmit={handleSubmit}>


<input

name="name"

value={recipe.name}

placeholder="Recipe Name"

onChange={handleChange}

/>



<input

name="category"

value={recipe.category}

placeholder="Category"

onChange={handleChange}

/>



<input

name="cuisine"

value={recipe.cuisine}

placeholder="Cuisine"

onChange={handleChange}

/>



<input

name="image"

value={recipe.image}

placeholder="Image URL"

onChange={handleChange}

/>



<textarea

name="ingredients"

value={recipe.ingredients}

placeholder="Ingredients separated by comma"

onChange={handleChange}

/>



<textarea

name="instructions"

value={recipe.instructions}

placeholder="Instructions separated by comma"

onChange={handleChange}

/>



<input

name="prepTime"

value={recipe.prepTime}

placeholder="Prep Time"

onChange={handleChange}

/>



<input

name="cookTime"

value={recipe.cookTime}

placeholder="Cook Time"

onChange={handleChange}

/>



<input

type="number"

name="servings"

value={recipe.servings}

placeholder="Servings"

onChange={handleChange}

/>



<select

name="difficulty"

value={recipe.difficulty}

onChange={handleChange}

>


<option value="Easy">
Easy
</option>


<option value="Medium">
Medium
</option>


<option value="Hard">
Hard
</option>


</select>





<div className="edit-buttons">


<button

type="button"

className="cancel-btn"

onClick={closeModal}

>

Cancel

</button>




<button

type="submit"

className="update-btn"

>

Update Recipe

</button>



</div>




</form>



</div>


</div>


);


}


export default EditRecipe;