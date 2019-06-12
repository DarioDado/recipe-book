import { Recipe } from './recipe.model';
import { Injectable } from '@angular/core';
import { Ingredient } from '../shared/ingredient.model';
import { ShoppingListService } from '../shopping-list/shopping-list.service';
import { Subject } from 'rxjs';
import { Http, Response } from '@angular/http';
import { map } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class RecipeService {
    recipesChanged: Subject<Recipe[]> = new Subject();

    private   recipes: Recipe[] = [
        new Recipe(
          'Tasty Schnitzel', 
          'a super-tasty Schnitzel - just awesome!', 
          'https://thecozyapron.com/wp-content/uploads/2012/02/schnitzel_thecozyapron_1.jpg',
          [
              new Ingredient('Meat', 1),
              new Ingredient('French Fries', 20),
          ]
        ),
        new Recipe(
          'Big Fat Burger', 
          'What else you need to say?', 
          'https://www.readersdigest.ca/wp-content/uploads/sites/14/2015/11/gourmet-burger-1024x666.jpg',
          [
              new Ingredient('Buns', 2),
              new Ingredient('Meat', 1),
          ]
        ),
    ];

    constructor(
        private shoppingListService: ShoppingListService,
        private http: Http,
        private authService: AuthService
    ) {}

    getRecipes() {
        return this.recipes.slice();
    }

    adIngredientsToShoppingList(ingredients: Ingredient[]) {
        this.shoppingListService.addIngredients(ingredients);
    }

    getRecipe(id: number): Recipe {
        return this.recipes[id];
    }

    updateRecipe(id: number, recipe: Recipe) {
        this.recipes[id] = recipe;
        this.recipesChanged.next(this.recipes.slice());
    }

    addRecipe(recipe: Recipe) {
        this.recipes.push(recipe);
        this.recipesChanged.next(this.recipes.slice());
        return this.recipes.length - 1;
    }

    deleteRecipe(id: number) {
        this.recipes.splice(id, 1);
        this.recipesChanged.next(this.recipes.slice());
    }

    saveRecipes() {
        const token  = this.authService.getToken();
        return this.http.put('https://httpangularudemy.firebaseio.com/recipes.json?auth=' + token, this.recipes);
    }

    fetchRecipes() {
        const token  = this.authService.getToken();
        return this.http.get('https://httpangularudemy.firebaseio.com/recipes.json?auth=' + token)
            .pipe(
                map( (response: Response) => {
                    return response.json();
                }),
                map((recipesData) => {
                    let recipes = recipesData.map((recipeData) => {
                        let ingredients = recipeData.ingredients.map((ingredientData) => {
                            return new Ingredient(ingredientData.name, ingredientData.amount);
                        });
                        return new Recipe(recipeData.name, recipeData.description, recipeData.imageUrl, ingredients);
                    });
                    return recipes;
                })
            ).subscribe(
                (recipes) => this.setRecipes(recipes),
                (error) => console.log(error)
            );
    }

    setRecipes(recipes: Recipe[]) {
        this.recipes = recipes;
        this.recipesChanged.next(this.recipes.slice());
    }
}