import { computed, inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Product } from '../../shared/models/product';
import { CartItem } from '../../shared/models/cartItem';
import { ShoppingCart } from '../../shared/models/shoppingCart';
import { count, map } from 'rxjs';
import { DeliveryMethod } from '../../shared/models/deliveryMethod';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  baseUrl = environment.apiUrl;
  private http = inject(HttpClient);
  cart = signal<ShoppingCart | null>(null);

  itemCount = computed(() => this.cart()?.items.reduce((sum, item) => sum + item.quantity, 0));

  selectedDelivery = signal<DeliveryMethod | null>(null);

  totals = computed(() => {
    const cart = this.cart();
    if(!cart) return null;

    const delivery = this.selectedDelivery();

    const subtotal = cart.items.reduce((sum, item) => sum + item.quantity * item.price, 0);
    const shipping = delivery ? delivery.price : 0;
    const discount = 0;

    return{
      subtotal,
      shipping,
      discount,
      total: subtotal + shipping - discount
    }
  });

  getCart(id:string){
    return this.http.get<ShoppingCart>(this.baseUrl  + 'cart?id=' + id).pipe(
      map(cart => {
        this.cart.set(cart);
        return cart;
      })
    )
  }

  setCart(cart:ShoppingCart){
    return this.http.post<ShoppingCart>(this.baseUrl  + 'cart', cart).subscribe({
      next: cart => this.cart.set(cart)
    })
  }

  addItemToCart(item:Product | CartItem, quantity = 1){
    const cart = this.cart() ?? this.createCart();

    if(this.isProduct(item)){
      item = this.mapProductToCartItem(item);
    }

    cart.items = this.addOrUpdateItem(cart.items, item, quantity);

    this.setCart(cart);
  }

  removeItemfromCart(productId:number | CartItem, quantity = 1){
    const cart = this.cart();

    if(!cart) return;

    const index = cart.items.findIndex(i => i.productId == productId);

    if(index !== -1)
    {
      if(cart.items[index].quantity > quantity){
        cart.items[index].quantity -= quantity;
      }
      else{
        cart.items.splice(index, 1);
      }

      if(cart.items.length == 0){
        this.deleteCart()
      }
      else{
        this.setCart(cart);
      }
    }
  }

  deleteCart() {
    this.http.delete(this.baseUrl  + 'cart?id=' + this.cart()?.id).subscribe({
      next: () => 
      {
        localStorage.removeItem('cart_id');
        this.cart.set(null);
      }
    })
  }

  private addOrUpdateItem(items: CartItem[], item: CartItem, quantity: number): CartItem[] {
    const index = items.findIndex(i => i.productId == item.productId);

    if(index == -1){
      item.quantity = quantity;
      items.push(item);
    }
    else{
      items[index].quantity += quantity;
    }

    return items;
  }

  private mapProductToCartItem(item: Product): CartItem {
    return {
      productId: item.id,
      productName: item.name,
      price: item.price,
      quantity: 0,
      pictureUrl: item.pictureUrl,
      brand: item.brand,
      type: item.type
    }
  }

  private isProduct(item:Product | CartItem): item is Product{
    return (item as Product).id !== undefined;
  }

  private createCart(): ShoppingCart {
    const cart = new ShoppingCart();
    localStorage.setItem('cart_id', cart.id);
    return cart;
  }
}
