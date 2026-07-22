import React from "react";


function RecipeCard({recipe,onDelete}){


return(

<div className="card">


<img 
src={recipe.image}
alt={recipe.name}
/>


<h3>
{recipe.name}
</h3>


<button>
View Details
</button>


<button>
Update
</button>


<button
onClick={()=>onDelete(recipe._id)}
>
Delete
</button>


</div>

)

}


export default RecipeCard;