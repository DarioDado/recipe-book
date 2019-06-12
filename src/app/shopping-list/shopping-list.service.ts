import { Ingredient } from '../shared/ingredient.model';
import { Subject } from 'rxjs';
import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { map } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class ShoppingListService {
    ingredientsChanged: Subject<Ingredient[]> = new Subject();
    ingredientSelected: Subject<number> = new Subject();
    private ingredients: Ingredient[] = [
        new Ingredient('Apple', 5),
        new Ingredient('Tomato', 10),
    ];

    constructor(
        private http: Http,
        private authService: AuthService
    ) {}

    getIngredients() {
        return this.ingredients.slice();
    }

    addIngredient(name: string, amount: number) {
        this.ingredients.push(new Ingredient(name,amount));
        this.ingredientsChanged.next(this.ingredients.slice());
    }

    addIngredients(ingredients: Ingredient[]) {
        // this.ingredients = this.ingredients.concat(ingredients);
        this.ingredients.push(...ingredients);
        this.ingredientsChanged.next(this.ingredients.slice());
    }

    getIngredient(index:number) {
        return this.ingredients[index];
    }

    updateIngredient(i:number, newName: string, newAmount: number) {
        this.ingredients[i].name = newName;
        this.ingredients[i].amount = newAmount;
        this.ingredientsChanged.next(this.ingredients.slice());
    }

    deleteItem (index: number) {
        this.ingredients.splice(index,1);
        this.ingredientsChanged.next(this.ingredients.slice());
    }

    saveIngrediants() {
        const token  = this.authService.getToken();
        return this.http.put('https://httpangularudemy.firebaseio.com/ingredients.json?auth=' + token, this.ingredients);
    }

    fetchIngredients() {
        const token  = this.authService.getToken();
        this.http.get('https://httpangularudemy.firebaseio.com/ingredients.json?auth=' + token)
            .pipe(
                map( (response: Response) => {
                    return response.json();
                }),
                map((ingredientsData: any[]) => {
                    let ingredients = ingredientsData.map((ingredientData) => {
                        return new Ingredient(ingredientData.name, ingredientData.amount);
                    });
                    return ingredients;
                })
            ).subscribe(
                (ingredients) => this.setIngredients(ingredients),
                (error) => console.log(error)
            );
    }

    setIngredients(ingredients: Ingredient[]) {
        this.ingredients = ingredients;
        this.ingredientsChanged.next(this.ingredients.slice());
    }
}