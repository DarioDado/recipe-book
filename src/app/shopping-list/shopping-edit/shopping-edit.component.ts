import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { ShoppingListService } from '../shopping-list.service';
import { NgForm } from '@angular/forms';
import { Ingredient } from 'src/app/shared/ingredient.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css']
})
export class ShoppingEditComponent implements OnInit, OnDestroy {
  @ViewChild('f') form: NgForm;
  selectedIngSubscription: Subscription;
  editMode: boolean = false;
  selectedIngredientIndex: number;
  selectedIngredient: Ingredient;

  constructor(private shoppingListService: ShoppingListService) { }

  ngOnInit() {
    this.selectedIngSubscription = this.shoppingListService.ingredientSelected.subscribe((index: number) => {
      this.editMode = true;
      this.selectedIngredientIndex = index;
      this.selectedIngredient = this.shoppingListService.getIngredient(index);
      this.form.setValue({
        'name': this.selectedIngredient.name,
        'amount': this.selectedIngredient.amount
      });
    })
  }

  onAddIngredient(form: NgForm) {
    const ingName = form.value.name;
    const ingAmount = form.value.amount;
    if (!this.editMode) {
      this.shoppingListService.addIngredient(ingName, ingAmount);
    } else {
      this.shoppingListService.updateIngredient(this.selectedIngredientIndex, ingName, ingAmount);
    }
    this.onClearList();
  }

  onDelete() {
    this.shoppingListService.deleteItem(this.selectedIngredientIndex);
    this.onClearList();
  }

  onClearList() {
    this.editMode = false;
    this.form.reset();
  }

  ngOnDestroy() {
    this.selectedIngSubscription.unsubscribe();
  }

}
