import { NgModule } from '@angular/core';

import { Routes, RouterModule } from "@angular/router";

import { RecepiesComponent } from './recepies/recepies.component';
import { ShoppingListComponent } from './shopping-list/shopping-list.component';
import { RecipeDetailComponent } from './recepies/recipe-detail/recipe-detail.component';
import { SelectRecipeComponent } from './recepies/select-recipe/select-recipe.component';
import { EditRecipeComponent } from './recepies/edit-recipe/edit-recipe.component';
import { SignupComponent } from './auth/signup/signup.component';
import { SigninComponent } from './auth/signin/signin.component';

const appRoutes: Routes = [
    {path: '', redirectTo: '/recipes', pathMatch: 'full'},
    {path: 'recipes', component: RecepiesComponent, children: [
        {path: '', component: SelectRecipeComponent},
        {path: 'new', component: EditRecipeComponent},
        {path: ':id', component: RecipeDetailComponent},
        {path: ':id/edit', component: EditRecipeComponent},
    ]},
    {path: 'shopping-list', component: ShoppingListComponent},
    {path: 'signup', component: SignupComponent},
    {path: 'signin', component: SigninComponent},
]

@NgModule({
    imports: [
        RouterModule.forRoot(appRoutes),
    ],
    exports: [
        RouterModule,
    ]
})
export class AppRouterModule {}