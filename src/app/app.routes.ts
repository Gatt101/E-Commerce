import { Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout/layout.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { ProductComponent } from './components/product/product.component';
import { CartComponent } from './components/cart/cart.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { OrdersComponent } from './components/orders/orders.component';

export const routes: Routes = [
    {path: '', component: LayoutComponent,children:[
        {path:'',redirectTo: 'home',pathMatch: 'full'},
        {path: 'home',component:HomeComponent},
        {path:'login',component:LoginComponent},
        {path:'product',component:ProductComponent},
        {path: 'cart', component: CartComponent},
        {path: 'myOrder',component:OrdersComponent}
    ]},
    {path:'register',component:RegisterComponent},
    {path:'checkout',component:CheckoutComponent}
];
