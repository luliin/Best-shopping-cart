$(function (loadCheckout) {
  loadCheckout();
  addListenersToInputFields();
  confirmPurchase();

  function loadCheckout() {
    console.log("Hej");

    let cart = setCart();
    let output = "";

    let mapCart = createMapOfCart(cart);
    // let mapCart = new Map();

    // cart.forEach((item) => {
    //   if (mapCart.has(item.id)) {
    //     mapCart.set(item.id, mapCart.get(item.id) + 1);
    //   } else {
    //     mapCart.set(item.id, 1);
    //   }
    // });

    let totalPrice = 0;

    for (let [key, value] of mapCart.entries()) {
      let item = fetchFromCart(key);
      console.log(item);
      console.log(item.title + " = " + value);
      let linePrice = value * item.price;
      output += `<div class="container order-list">
                    <div class="row border py-sm-3 text-center">
                      <div class="col-5 col-sm-6 text-start">${item.title}</div>
                      <div class="col-2 col-sm-2">${item.price}€</div>
                      <div class="col-2 smaller quantity-checkout"><span class="border text-start px-2 quantity" id="${
                        item.id
                      }">${value}</span></div>
                      <div class="col-2 line-price col-sm-2 pe-2" id="${
                        item.id
                      }">${roundDecimals(linePrice)}€</div>
                    </div>
                  </div>`;
      totalPrice += linePrice;
    }
    totalPrice = roundDecimals(totalPrice);
    $("#cartOutput").html(output);
    $("#priceOutput").text(totalPrice + "€");
  }

  function setCart() {
    return (cart = JSON.parse(localStorage.getItem("cart")) ?? []);
  }

  //   $("#confirmPurchase").on("click", function () {
  //     console.log("Bekräftar köp!");
  //   });

  function confirmPurchase() {
    $("#confirmPurchase").click(function () {
      console.log("Bekräftar köp!");
      validate();
    });
  }

  function validate() {
    let $phoneNumber = $("#inputPhoneNumber");
    let $zipCode = $("#inputZip");
    let $firstName = $("#firstNameInput");
    let $lastName = $("#lastNameInput");
    let $street = $("#inputStreet");
    let $city = $("#inputCity");
    let $email = $("#inputEmail");

    let phoneNumber = $phoneNumber.val();
    let zipCode = $zipCode.val();
    let firstName = $firstName.val();
    let lastName = $lastName.val();
    let street = $street.val();
    let city = $city.val();
    let email = $email.val();

    let namePattern = /\p{L}/gu;
    let phonePattern = /^[(]{0,1}[0-9]{3}[)]{0,1}[-\s\.]{0,1}[0-9]{3}[-\s\.]{0,1}[0-9]{4}$/;
    let zipCodePattern = /^[1-9][0-9]{2} ?[0-9]{2}$/;
    let emailPattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    let phoneResult = {
      result: testRegex(phonePattern, phoneNumber),
      error: "#phoneError",
    };
    let zipResult = {
      result: testRegex(zipCodePattern, zipCode),
      error: "#zipError",
    };

    let firstNameResult = {
      result: testRegex(namePattern, firstName),
      error: "#firstNameError",
    };
    let lastNameResult = {
      result: testRegex(namePattern, lastName),
      error: "#lastNameError",
    };
    let streetResult = {
      result: testRegex(namePattern, street),
      error: "#streetError",
    };
    let cityResult = {
      result: testRegex(namePattern, city),
      error: "#cityError",
    };
    let emailResult = {
      result: testRegex(emailPattern, email),
      error: "#emailError",
    };

    let resultSet = [
      phoneResult,
      zipResult,
      firstNameResult,
      lastNameResult,
      streetResult,
      cityResult,
      emailResult,
    ];

    resultSet.forEach((element) => {
      displayResult(element);
    });

    let check = evaluateInput(resultSet);

    if (check) {
      Swal.fire({
        icon: "success",
        width: 600,
        title: "Tack för din order, " + firstName + "!",
        html: `Vi jobbar för att du ska få den levererad så snart som möjligt. <br> 
          Observera att denna butik är helt fiktiv, varför varorna kanske inte lever upp till dina förväntningar. <br>
          Vi hoppas att du kan ha överseende med detta, och att du ändå känner dig nöjd med din beställning. <br>
          <hr>
          <h5 class="text-info">På återseende, önskar Julia med personal!</h5>`,
      })
        .then(function () {
          window.open("./index.html", "_self");
        })
        .then(clearCart());
    } else console.log("Det fanns fel");
  }

  function addListenersToInputFields() {
    $("#firstNameInput").on("click", function () {
      hideErrorMessages();
    });

    $("#lastNameInput").on("click", function () {
      hideErrorMessages();
    });

    $("#inputStreet").on("click", function () {
      hideErrorMessages();
    });

    $("#inputCity").on("click", function () {
      hideErrorMessages();
    });

    $("#inputZip").on("click", function () {
      hideErrorMessages();
    });

    $("#inputPhoneNumber").on("click", function () {
      hideErrorMessages();
    });

    $("#inputEmail").on("click", function () {
      hideErrorMessages();
    });
  }

  function hideErrorMessages() {
    $("#firstNameError").hide();
    $("#lastNameError").hide();
    $("#streetError").hide();
    $("#cityError").hide();
    $("#zipError").hide();
    $("#phoneError").hide();
    $("#emailError").hide();
  }

  function testRegex(regex, target) {
    return regex.test(target);
  }

  function displayResult(result) {
    if (!result.result) {
      $(result.error).show();
    }
  }

  function evaluateInput(resultSet) {
    let isValid = true;
    resultSet.forEach((element) => {
      console.log(element.result);
      if (!element.result) {
        isValid = false;
      }
    });
    return isValid;
  }
});
