let products = [];
let cartMap = new Map();
//Shorthand for $(document).ready(load)
$(function () {
  load();
  $(".navbar-toggler").click(function () {
    console.log("Meny klickad på");
    $("#navbarExample01").slideToggle();
  });
});

function load() {
  $.getJSON("https://webacademy.se/fakestore/", (response) => {
    products = response;
    renderProducts(products);
  });
}

function showMenu() {
    console.log("Meny klickad på");
    $("#exampleMenu01").show();
}

function updateCartLabel() {
  let $label = $("#cart-label");
  setCart().length == 0 ? $label.hide() : $label.show();
  $label.text(cart.length);
}

function addListeners() {
  document.querySelectorAll(".add-button").forEach(function (elem) {
    elem.addEventListener("click", function () {
      console.log("Klick");
    });
  });
}

function addToCart(id) {
  cart.push(products.find((product) => product.id == id));
  localStorage.setItem("cart", JSON.stringify(cart));
}

function setCart() {
  return (cart = JSON.parse(localStorage.getItem("cart")) ?? []);
}

function clearCart() {
  localStorage.removeItem("cart");
}

function confirmDeleteCart() {
  if (setCart().length == 0) {
    showEmptyCart();
  } else {
    Swal.fire({
      title: "Är du säker på att du vill tömma varukorgen?",
      text: "Det går inte att ångra sig!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      cancelButtonText: "Avbryt!",
      confirmButtonText: "Töm!",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire("Tömd!", "Varukorgen har tömts.", "success");
        clearCart();
        hideCart();
        updateCartLabel();
        restoreButtons();
      }
    });
  }
}

function showEmptyCart() {
  console.log("I show empty cart");
  Swal.fire(
    "Din varukorg är tom!",
    "Tryck ok för att börja shoppa.",
    "warning"
  ).then(hideCart());
}

function hideCart() {
  $("#exampleModal").modal("hide");
}

function renderProducts(products) {
  let cart = setCart();
  if (cart.length == 0) {
    $("#cart-label").hide();
  } else {
    updateCartLabel();
  }

  let inCartText = "I varukorgen";
  let addText = "Lägg till";

  let output = "";
  products.forEach((product) => {
    let buttonText = cart.find((prod) => prod.id == product.id)
      ? inCartText
      : addText;
    output += `<div class="col" id="${product.id}">
            <div class="card">
                <div class="container mt-4">
              <img
                src="${product.image}"
                class="card-img-top image"
                alt="..."
              /> </div>
              <div class="card-body">
                <h5 class="card-title">${product.title}</h5>
                <h6 class="card-price">Pris: ${product.price} euro</h6>
                <div class="fixed-height-text">
                <p class="card-text">
                  ${product.description}
                </p>
                </div>
                <button class="btn btn-outline-warning mt-4 add-button full-width" id="${product.id}">${buttonText}</button>
              </div>
            </div>
          </div>`;
  });

  $("#demo").before(output);
  $(".add-button").click(function (e) {
    let $this = $(this);
    $this.text("I varukorgen");
    console.log(e.target.id);
    addToCart(e.target.id);
    console.log(cart);
    updateCartLabel();
  });
  // addListeners();
}

function restoreButtons() {
  $(".add-button").text("Lägg till");
}

function showCart() {
  let cart = setCart();
  if (cart.length == 0) {
    showEmptyCart();
    $("#exampleModal").modal("hide");
  } else {
    $("#exampleModal").modal("show");
    let output = "";
    let mapCart = new Map();

    cart.forEach((item) => {
      if (mapCart.has(item.id)) {
        mapCart.set(item.id, mapCart.get(item.id) + 1);
      } else {
        mapCart.set(item.id, 1);
      }
    });

    let totalPrice = 0;

    for (let [key, value] of mapCart.entries()) {
      let item = fetchFromCart(key);
      console.log(item);
      console.log(item.title + " = " + value);
      let linePrice = value * item.price;
      output += `<div class="container">
                    <div class="row border py-3 text-center">
                      <div class="col-1"><i class="bi bi-trash-fill"></i></div>
                      <div class="col-5 col-4-sm text-start">${item.title}</div>
                      <div class="col-2 ">${item.price} euro</div>
                      <div class="col-2 smaller "><i class="bi bi-dash-circle remove-button" id="${
                        item.id
                      }"></i>
<span class="border text-center px-2 quantity" id="${
        item.id
      }">${value}</span> <i class="bi bi-plus-circle-fill increase-button" id="${
        item.id
      }"></i></div>
                      <div class="col-2 line-price" id="${
                        item.id
                      }">${roundDecimals(linePrice)} euro</div>
                    </div>
                  </div>`;
      totalPrice += linePrice;
    }
    totalPrice = roundDecimals(totalPrice);
    $("#cartOutput").html(output);
    $("#priceOutput").text(totalPrice + " euro");

    $(".remove-button").click(function (e) {
      console.log(e.target.id);
      decrementItem(e.target.id, mapCart);
      updateCartQuantityLabel(e.target.id, mapCart);
      updateCartLabel();
      updateCartLinePriceLabel(e.target.id, mapCart);
      $("#priceOutput").text(calculateTotalPrice() + " euro");
    });
    $(".increase-button").click(function (e) {
      console.log(e.target.id);
      incrementItem(e.target.id, mapCart);
      updateCartQuantityLabel(e.target.id, mapCart);
      updateCartLabel();
      updateCartLinePriceLabel(e.target.id, mapCart);
      $("#priceOutput").text(calculateTotalPrice() + " euro");
    });
  }
}

function calculateTotalPrice() {
  let sum = 0;
  $(".line-price").each(function () {
    let split = $(this).text().split(" ");
    sum += Number(split[0]);
  });
  return roundDecimals(sum);
}

function roundDecimals(number) {
  return Math.round(number * 100 + Number.EPSILON) / 100;
}

function fetchFromCart(id) {
  let cart = setCart();
  return cart.find((item) => item.id == id);
}

function decrementItem(id, map) {
  if (map.get(+id) <= 1) return console.log("Kan inte minska");
  else {
    map.set(+id, map.get(+id) - 1);
    mapCart = map;
    updateCartLocalStorage(map);
  }
}

function incrementItem(id, map) {
  map.set(+id, map.get(+id) + 1);
  mapCart = map;
  updateCartLocalStorage(map);
}

function updateCartLocalStorage(map) {
  clearCart();
  cart = setCart();
  for (let [key, value] of map.entries()) {
    for (let i = 0; i < value; i++) {
      addToCart(key);
    }
  }
}

function updateCartQuantityLabel(id, map) {
  let quantity = map.get(+id);
  $("#" + id + ".quantity").text(quantity);
}

function updateCartLinePriceLabel(id, map) {
  let item = fetchFromCart(+id);
  console.log(item.price);
  let quantity = map.get(+id);
  let linePrice = quantity * item.price;
  console.log(linePrice);
  console.log(quantity);
  $("#" + id + ".line-price").text(linePrice + " euro");
  // return (quantity < 1) ? 0 : item.price;
}