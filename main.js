function updateLocalStorage(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }
  
  async function getproducts() {
    try {
      const data = await fetch("https://ecommercebackend.fundamentos-29.repl.co");
      const res = await data.json();
  
      updateLocalStorage("products", res);
  
      return res;
    } catch (error) {
      console.error(error);
    }
  }
  
  function printProducts(db) {
    let html = "";
  
    db.products.forEach(({ image, name, price, quantity, id }) => {
      html += `
        <div class="product">
          <div class="product_img">
            <img src="${image}" alt="${name}">
          </div>
          <div class="product__body">
            <h4>${name}</h4>
            <p>
              <b>Precio: </b> $${price}.00
            </p>
            <p>
              <b>Stock: </b> ${quantity}
            </p>
            <i class='bx bx-plus' id="${id}"></i>
          </div>
        </div>
      `;
    });
  
    document.querySelector(".products").innerHTML = html;
  }
  
function printProductsCart(db) {
  let html = "";

        Object.values(db.cart).forEach((item) => {
          html += `
            <div class="cartItem">
             <div class="cartItem__img">
                <img src="${item.image}" alt="${item.name}"</div> 
            </div>

            <div className="cartItem__body">
              <h4>${item.name}</h4>
              <p>$${item.price}.00 | $${
                item.price * item.amount
              }.00</p>
          
            <div class="cartItem__options" data-id="${item.id}">
              <i class='bx bx-plus'></i>
              <span>${item.amount}</span>
              <i class='bx bx-minus'></i>
              <i class='bx bx-trash'></i>
        </div>
      </div>
  </div>
        `;
     });

       document.querySelector(".cart__products").innerHTML = html;

      }

  function handleShowCart() {
    const iconCart = document.querySelector("#iconCart");
    const cartHTML = document.querySelector(".cart");
  
    iconCart.addEventListener("click", function () {
      cartHTML.classList.toggle("cart__show");
    });
  }

  function addCartFromProducts(db) {
    const productsHTML = document.querySelector(".products");
  
    productsHTML.addEventListener("click", function (e) {
      if (e.target.classList.contains("bx-plus")) {
        const productId = Number(e.target.id);
  
        const productFind = db.products.find(function (product) {
          return product.id === productId;
        });
  
        if (db.cart[productId]) {
          if (db.cart[productId].amount === db.cart[productId].quantity)
            return alert("Ups, lo siento, no tenemos mas en Stock");

            db.cart[productId]. amount += 1;
        } else {
          db.cart[productId] = structuredClone(productFind);
          db.cart[productId].amount = 1;
        }

        updateLocalStorage("cart", db.cart);
        printTotal(db);
        printProductsCart(db);
      }
    });
  }

function printTotal(db) {
  const amountItemsHTML = document.querySelector('#amountItems')
  const cartTotalInfoHTML = document.querySelector(".cart__total--info");

    let amountProducts = 0;
    let priceTotal = 0;

      Object.values(db.cart).forEach((item) => {
        amountProducts += item.amount; 
        priceTotal += item.amount * item.price;
      });

    let html = `
        <p>
          <b> items:</b> ${amountProducts}  items
        </p>
        <p>
         <b>precio total: </b> ${priceTotal}.00 USD
        </p>
        `;

            cartTotalInfoHTML.innerHTML = html;
            amountItemsHTML.textContent = amountProducts;
}

  function handleCart(db) {
    const cartProductsHTML = document.querySelector(".cart__products");

     cartProductsHTML.addEventListener("click", function (e) {
      if (e.target.classList.contains("bx-minus")) {
        const productId = Number(e.target.parentElement.dataset.id);

        if (db.cart[productId].amount === 1) {
          const response = confirm(
            "En verdad quieres eliminar este producto?"
          );
          if (!response) return;
          delete db.cart[productId];
          }  else  { 
            db.cart[productId]. amount -= 1;
          }
    }

      if (e.target.classList.contains("bx-plus")) {
        const productId = Number(e.target.parentElement.dataset.id);

        if (db.cart[productId].amount === db.cart[productId].quantity)
            return alert("Ups, lo siento, no tenemos mas en Stock 🥲" );

        db.cart[productId].amount += 1;
      }

      if (e.target.classList.contains("bx-trash")) {
        const productId = Number(e.target.parentElement.dataset.id);

        const response = confirm(
          "En verdad quieres eliminar este producto? 😱"
        );
        if (!response) return;
        delete db.cart[productId];
    }
      printProductsCart(db);
      updateLocalStorage("cart", db.cart);
      printTotal(db)
  });
}
  
  async function main() {
    const db = {
      products:
        JSON.parse(localStorage.getItem("products")) ||
        (await getproducts()),
      cart: JSON.parse(localStorage.getItem("cart")) || {}, 
    };
  
    printProducts(db);
    handleShowCart();
    printProductsCart(db);
    addCartFromProducts(db)
    handleCart(db)
    printTotal(db)

    document.querySelector("#btn__buy").addEventListener("click", function () {
      if(!Object.values(db.cart).length) 
        return alert("En verdad quieres comprar un carrito sin nada 🤷‍♂️" ); 

      const newProducts = [];

      for (const product of db.products) {
        const productCart = db.cart[product.id];

        if (product.id === productCart?.id) {
          newProducts.push({
            ...product,
            quantity: product.quantity - productCart.amount,
          });
        }  else   {
          newProducts.push(productCart)
        }
      }
      });
}


main();
  
  


