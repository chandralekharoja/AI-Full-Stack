import "./RecipeCard.css";
import { Link, useNavigate } from "react-router-dom";
import { FaTrashAlt, FaEdit, FaPlus } from "react-icons/fa";

function RecipeCard({ recipe, onDelete, onEdit, showAddButton, onAdd }) {
  // Add Recipe Card

  if (showAddButton) {
    return (
      <div className="card add-card" data-testid="add-recipe-btn" onClick={onAdd}>
        <div className="add-icon">
          <FaPlus />
        </div>

        <h3>Add Recipe</h3>
      </div>
    );
  }


  // Normal Recipe Card
  return (
    <div className="card">
      <img src={recipe.image} alt={recipe.name} />

      <div className="card-actions">
        <button className="edit-btn" onClick={() => onEdit && onEdit(recipe)}>
          <FaEdit />
        </button>

        <button className="delete-btn" onClick={() => onDelete(recipe._id)}>
          <FaTrashAlt />
        </button>
      </div>

      <h3>{recipe.name}</h3>

      <Link to={`/recipe/${recipe._id}`}>View Recipe</Link>
    </div>
  );
}

export default RecipeCard;
