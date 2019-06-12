import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Recipe } from '../recipe.model';
import { RecipeService } from '../recipe.service';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { Ingredient } from 'src/app/shared/ingredient.model';

@Component({
  selector: 'app-edit-recipe',
  templateUrl: './edit-recipe.component.html',
  styleUrls: ['./edit-recipe.component.css']
})
export class EditRecipeComponent implements OnInit {
  recipe: Recipe;
  recipeIndex: number;
  editMode: boolean = false;
  recipeForm: FormGroup;

  constructor(
    private activeRoute: ActivatedRoute,
    private recipeService: RecipeService,
    private router: Router
  ) { }

  ngOnInit() {
    this.activeRoute.params.subscribe((params: Params) => {
      if (params.id || +params.id === 0) {
        this.recipeIndex = +params.id
        this.recipe = this.recipeService.getRecipe(this.recipeIndex);
        this.editMode = true;
      }
      this.initForm();
    });

  }

  onSubmit() {

    //fetch form values
    let ingredients = this.recipeForm.get('ingredients').value.map(ingredient => {
      return new Ingredient(ingredient.name, ingredient.amount);
    });
    let name = this.recipeForm.get('name').value;
    let description = this.recipeForm.get('description').value;
    let imageUrl = this.recipeForm.get('imageUrl').value;
    
    let recipe = new Recipe(name, description, imageUrl, ingredients);

    //edit or create new recipe
    if (this.editMode) {
      this.recipeService.updateRecipe(this.recipeIndex, recipe);
      this.router.navigate(['/recipes', this.recipeIndex]);
    } else {
      let newRecipeIndex = this.recipeService.addRecipe(recipe);
      this.router.navigate(['/recipes', newRecipeIndex]);
    }

    //clear form
    this.clearForm();
  }

  private initForm() {
    let ingredients = new FormArray([]);
    if (this.editMode && this.recipe.ingredients) {
      for (let ingredient of this.recipe.ingredients) {
        ingredients.push(
          new FormGroup({
            'name': new FormControl(ingredient.name, Validators.required),
            'amount': new FormControl(ingredient.amount, [Validators.required, Validators.pattern(/^[1-9]+[0-9]*$/)]),
          })
        );
      }
    }
    this.recipeForm = new FormGroup({
      'name': new FormControl(this.editMode ? this.recipe.name : null, Validators.required),
      'description': new FormControl(this.editMode ? this.recipe.description : null, Validators.required),
      'imageUrl': new FormControl(this.editMode ? this.recipe.imageUrl : null, Validators.required),
      'ingredients': ingredients,
    });
  }

  onDeleteIngredientInput(i:number) {
    (<FormArray>this.recipeForm.get('ingredients')).removeAt(i);
  }

  onAddIngredientInput() {
    (<FormArray>this.recipeForm.get('ingredients')).push(
      new FormGroup({
        'name': new FormControl(null, Validators.required),
        'amount': new FormControl(null, [Validators.required,  Validators.pattern('^[1-9]+[0-9]*$')]),
      })
    )
  }

  getControls(){
    return (<FormArray>this.recipeForm.get('ingredients')).controls;
  }

  onCancel() {
    this.router.navigate(['../'], {relativeTo: this.activeRoute});
  }

  private clearForm() {
    this.recipeForm.reset();
    this.editMode = false;
  }

}
