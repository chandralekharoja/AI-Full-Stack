import mongoose from "mongoose";

const recipeSchema = new mongoose.Schema(
{
    user_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },

    name:{
        type:String,
        required:true,
        trim:true
    },

    category:{
        type:String,
        required:true
    },

    cuisine:{
        type:String,
        required:true
    },

    image:{
        type:String,
        required:true
    },

    ingredients:[
        {
            type:String,
            required:true
        }
    ],

    instructions:[
        {
            type:String,
            required:true
        }
    ],

    prepTime:{
        type:String,
        required:true
    },

    cookTime:{
        type:String,
        required:true
    },

    servings:{
        type:Number,
        required:true
    },

    difficulty:{
        type:String,
        enum:["Easy","Medium","Hard"],
        required:true
    }

},
{
 timestamps:true
});


export default mongoose.model("Recipe",recipeSchema,"Recipe");