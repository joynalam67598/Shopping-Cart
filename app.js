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

//  const btns = document.querySelectorAll('.bag-btn');
// console.log(btns)

// cart
let cart = []

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
                        <i class="fas fa-shopping-cart">Add to bag</i>
                    </button>
                </div>
                <h3>${product.title}</h3>
                <h4>$${product.price}</h4>
            </articale>
            `;
        });
        productsDom.innerHTML = result;
    };
    getBack() {
         
    }


}
// local storage -->inspect > application > local storage
class Storage {
    static saveProducts(products) {
        localStorage.setItem("products", JSON.stringify(products));
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const ui = new UI();
    const products = new Products();
    // get all products
    products.getProducts()
        .then(products => {
            ui.displayProducts(products);
            Storage.saveProducts(products);
        }).then(() => {


        });
})