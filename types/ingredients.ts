'use strict';
export type IDrinkIngredient = {
  // This is normalized off of IIngredient. Probably fine.
  name: string;
  ingredientId: number;
  amount: number;
  unit: string;
};

export type IDrink = {
  id: number;
  name: string;
  source: string;
  drinkIngredients: IDrinkIngredient[];
  ingredientTypes: number[];
  ingredientSuperTypes: number[];
};

export type IIngredientType = {
  id: number;
  name: string;
};

export type IIngredient = {
  id: number;
  name: string;
  ingredientType: number;
  ingredientSuperType?: number;
};

export type IngredientOrType = IIngredient | IIngredientType;

export type AutoSuggestState = {
  suggestions: string[];
  pickedSuggestions: IngredientOrType[];
  value: string;
  pageNum: number;
};

export type DrinkState = {
  ingredients: IIngredient[];
  ingredientTypes: IIngredientType[];
  drinks: IDrink[];
};

export type FullState = {
  autoSuggest: AutoSuggestState;
  drinks: DrinkState;
};
