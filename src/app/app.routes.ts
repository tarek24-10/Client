import { Routes } from '@angular/router';
import { Home } from './features/home/home';
import { Shop } from './features/shop/shop';
import { ProductDetails } from './features/shop/product-details/product-details';
import { TestError } from './features/test-error/test-error';

export const routes: Routes = [
    {path:'', component:Home},
    {path:'shop', component:Shop},
    {path:'shop/:id', component:ProductDetails},
    {path:'test-error', component:TestError},
    {path:'**', redirectTo:'', pathMatch:'full'}
];
