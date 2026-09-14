import { Route } from "@angular/router";
import { authGuard } from "../../core/guards/auth-guard";
import { OrderDetailed } from "./order-detailed/order-detailed";
import { Orders } from "./orders";

export const orderRoutes:Route[] = [
    {path:'', component:Orders, canActivate: [authGuard]},
    {path:':id', component:OrderDetailed, canActivate: [authGuard]},
]








    