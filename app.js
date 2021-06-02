// variables

const cartBtn = document.querySelector('.cart-btn');
const colseCartBtn = document.querySelector('.close-cart');
const clearCartBtn = document.querySelector('.clear-cart');
const cartDom = document.querySelector('.cart');
const cartOverlay = document.querySelector('.cart-overlay');
const cartItems = document.querySelector('.cart-items');
const cartTotal = document.querySelector('.cart-total');
const cartContent = document.querySelector('.cart-content');
const productsDom = document.querySelector('.products-center');

//  
// console.log(btns)

// cart
let cart = [];

// buttons 
let buttonsDOM = [];

// getting the products
class Products {
    async getProducts() {
        try {
            let res = await fetch('products.json');
            let data = await res.json();
            let products = data.items;
            // return data --> instead of this -->
            // rearange ta array of products.
            products = products.map(item => {
                const { title, price } = item.fields;
                const { id } = item.sys;
                const image = item.fields.image.fields.file.url;
                return { title, price, id, image }
            })
            return products;

        } catch (er) {
            console.log(er);
        }

    }
}

// display products
class UI {
    displayProducts(products) {
        let result = '';
        products.forEach(product => {
            result += `
            <articale class="product">
                <div class="img-container">
                    <img src=${product.image} class="product-img" alt="product 1">
                    <button class="bag-btn" data-id=${product.id}>
                        <i class="fas fa-shopping-cart">Add To Cart</i>
                    </button>
                </div>
                <h3>${product.title}</h3>
                <h4>$${product.price}</h4>
            </articale>
            `;
        });
        productsDom.innerHTML = result;
    };
    getBagBack() {
        const buttons = [...document.querySelectorAll('.bag-btn')]; // ... sprade operator
        buttonsDOM = buttons;
        buttons.forEach(button => {
            let itemId = button.dataset.id;
            let inCart = cart.find(item => item.id === itemId);
            if (inCart) {
                button.innerHTML = 'In Cart';
                button.disabled = true;
            }
            button.addEventListener('click', (event) => {
                event.target.innerHTML = 'In Cart';
                event.target.disabled = true;
                //get product from producs
                let cartItem = { ...Storage.getProduct(itemId), ammount: 1 };

                // add product to cart -> previous cart data + new item
                cart = [...cart, cartItem];

                // save cart in local storage -> if we refresh our page, still we can get cart data:).
                Storage.saveCart(cart);

                // set cart value
                this.setCartValue(cart);

                // display cart item
                this.addCartItem(cartItem);

                //show the cart
                this.showCart();

            });

        });
    };
    setCartValue(cart) {
        let tempTotal = 0;
        let itemsTotal = 0;
        cart.map(item => {
            tempTotal += item.price * item.ammount;
            itemsTotal += item.ammount;
        });
        cartTotal.innerText = parseFloat(tempTotal.toFixed(2));
        cartItems.innerText = itemsTotal;
    }
    addCartItem(item) {
        const div = document.createElement('div');
        div.classList.add('cart-item');
        div.innerHTML = `
          <img src=${item.image} alt="product">
            <div>
               <h4>${item.title}</h4>
                <h5>$${item.price}</h5>
                 <span class="remove-item" data-id=${item.id}>remove</span>
            </div>
            <div>
               <i class="fas fa-chevron-up" data-id=${item.id}></i>
               <p class="item-ammount">${item.ammount}</p>
               <i class="fas fa-chevron-down" data-id=${item.id}></i>
            </div>
        `;
        cartContent.appendChild(div);

    }
    showCart() {
        cartOverlay.classList.add('transparentBcg');
        cartDom.classList.add('showCart');
    }
    setUpApp() {
        cart = Storage.getCart();
        this.setCartValue(cart);
        this.populate(cart);
        cartBtn.addEventListener('click', this.showCart);
        colseCartBtn.addEventListener('click', this.closeCart);

    }
    populate(cart) {
        cart.forEach(item => this.addCartItem(item));
    }
    closeCart() {
        cartOverlay.classList.remove('transparentBcg');
        cartDom.classList.remove('showCart');
    }
    cartLogic() {
        // clear cart button
        clearCartBtn.addEventListener('click', () => {
            let cartItems = cart.map(item => item.id);
            cartItems.forEach(id => this.removeCartItem(id));
            while (cartContent.children.length > 0) {
                cartContent.removeChild(cartContent.children[0]);
            }
            this.closeCart();
        });
        // cart funtionallity
        cartContent.addEventListener('click', event => {
            if (event.target.classList.contains('remove-item')) {
                let removeItem = event.target;
                let itemId = removeItem.dataset.id;
                cartContent.removeChild(removeItem.parentElement.parentElement);
                this.removeCartItem(itemId);
            }
            else if (event.target.classList.contains('fa-chevron-up')) {
                let item = event.target;
                let itemId = item.dataset.id;
                let cartItem = cart.find(item => item.id === itemId);
                cartItem.ammount += 1;
                Storage.saveCart(cart);
                this.setCartValue(cart);
                item.nextElementSibling.innerText = cartItem.ammount;
            }
            else if (event.target.classList.contains('fa-chevron-down')) {
                let item = event.target;
                let itemId = item.dataset.id;
                let cartItem = cart.find(item => item.id === itemId);
                cartItem.ammount -= 1;
                if (cartItem.ammount > 0) {
                    Storage.saveCart(cart);
                    this.setCartValue(cart);
                    item.previousElementSibling.innerText = cartItem.ammount;

                }
                else {
                    cartContent.removeChild(item.parentElement.parentElement);
                    this.removeCartItem(itemId);

                }
            }
        })

    }
    removeCartItem(itemId) {
        cart = cart.filter(item => item.id !== itemId);
        this.setCartValue(cart);
        Storage.saveCart(cart);
        let button = this.getSingleButton(itemId);
        button.disabled = false;
        button.innerHTML = `<i class='fas fa-shopping-cart'>Add to Cart</i>`

    }
    getSingleButton(itemId) {
        return buttonsDOM.find(button => button.dataset.id === itemId);
    }




}
// local storage -->inspect > application > local storage
class Storage {
    static saveProducts(products) {
        localStorage.setItem("products", JSON.stringify(products));
    }
    static getProduct(itemId) {
        let products = JSON.parse(localStorage.getItem('products'));
        return products.find(product => product.id === itemId);
    }
    static saveCart(cart) {
        localStorage.setItem("cart", JSON.stringify(cart));
    }
    static getCart() {
        return localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')) : [];
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const ui = new UI();
    const products = new Products();
    // setup application
    ui.setUpApp();
    // get all products
    products.getProducts()
        .then(products => {
            ui.displayProducts(products);
            Storage.saveProducts(products);
        }).then(() => {
            ui.getBagBack();
            ui.cartLogic();
        });
})