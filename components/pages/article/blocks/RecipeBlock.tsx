import React from "react";
import { RecipeContent } from "@/types/article";

const RecipeBlock: React.FC<RecipeContent> = ({
  level,
  kosher,
  prepTime,
  cookTime,
  recipeYield,
  recipeCategory,
  ingredientsGroups,
  recipeInstructions,
}) => {
  return (
    <div className="recipe-card bg-gray-50 p-6 rounded-lg mb-8">
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org/",
          "@type": "Recipe",
          name: recipeCategory,
          prepTime: `PT${prepTime}M`,
          cookTime: `PT${cookTime}M`,
          recipeYield: `${recipeYield.count} ${recipeYield.type}`,
          recipeIngredient: ingredientsGroups.flatMap((group) =>
            group.ingredients.map(
              (ing) => `${ing.count} ${ing.countType} ${ing.name}`
            )
          ),
          recipeInstructions: recipeInstructions.map((inst) => ({
            "@type": "HowToStep",
            text: inst.text,
          })),
        })}
      </script>

      <div className="recipe-meta grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="text-center">
          <span className="block text-sm text-gray-600">Prep Time</span>
          <strong>{prepTime} min</strong>
        </div>
        <div className="text-center">
          <span className="block text-sm text-gray-600">Cook Time</span>
          <strong>{cookTime} min</strong>
        </div>
        <div className="text-center">
          <span className="block text-sm text-gray-600">Difficulty</span>
          <strong className="capitalize">{level}</strong>
        </div>
        <div className="text-center">
          <span className="block text-sm text-gray-600">Kosher</span>
          <strong className="capitalize">{kosher}</strong>
        </div>
      </div>

      <div className="ingredients mb-6">
        <h3 className="text-xl font-bold mb-4">Ingredients</h3>
        {ingredientsGroups.map((group, index) => (
          <div key={index} className="mb-4">
            {group.title && (
              <h4 className="font-semibold mb-2">{group.title}</h4>
            )}
            <ul className="list-disc list-inside">
              {group.ingredients.map((ingredient, idx) => (
                <li key={idx}>
                  {ingredient.count} {ingredient.countType} {ingredient.name}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="instructions">
        <h3 className="text-xl font-bold mb-4">Instructions</h3>
        <ol className="list-decimal list-inside space-y-4">
          {recipeInstructions.map((instruction, index) => (
            <li key={index} className="pl-4">
              <span className="font-semibold">{instruction.name}:</span>{" "}
              {instruction.text}
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
};

export default RecipeBlock;
