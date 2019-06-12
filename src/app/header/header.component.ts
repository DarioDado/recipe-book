import { Component } from '@angular/core';
import { ShoppingListService } from '../shopping-list/shopping-list.service';
import { RecipeService } from '../recepies/recipe.service';
import { Response } from '@angular/http';

@Component({
    selector: 'app-header',
    styleUrls: ['./header.component.css'],
    templateUrl: './header.component.html'
})

export class HeaderComponent {

    constructor (
        private shoppingListService: ShoppingListService,
        private recipeService: RecipeService
    ) {}

    onSaveData() {
        this.recipeService.saveRecipes().subscribe(
            (response: Response) => console.log(response),
            (error) => console.log(error)
        );
        this.shoppingListService.saveIngrediants().subscribe(
            (response: Response) => console.log(response),
            (error) => console.log(error)
        );
    }

    onFetchData() {
        this.shoppingListService.fetchIngredients()
        this.recipeService.fetchRecipes()
    }
}