import { computed, inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Product } from '../../shared/models/product';
import { CartItem } from '../../shared/models/cartItem';
import { ShoppingCart } from '../../shared/models/shoppingCart';
import { count, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  baseUrl = environment.apiUrl;
  private http = inject(HttpClient);
  cart = signal<ShoppingCart | null>(null);

  itemCount = computed(() => this.cart()?.items.reduce((sum, item) => sum + item.quantity, 0));

  total = computed(() => {
    const cart = this.cart();
    if(!cart) return null;

    const subtotal = cart.items.reduce((sum, item) => sum + item.quantity * item.price, 0);
    const shipping = 0;
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
