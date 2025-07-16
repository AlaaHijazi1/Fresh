const inputs = document.querySelectorAll(".add__form-input");

const form = document.querySelector(".add__form");
const iconError = document.querySelectorAll(".add__form-error");

let lengthOfAllDrinks = +window.localStorage.getItem("lengthOfAllDrinks");
const myDrinks = JSON.parse(window.localStorage.getItem("myDrinks"));
//
const params = new URLSearchParams(window.location.search);
const drinkID = params.get("editId");

if (drinkID) {
  const backLink = document.createElement("a");
  backLink.href = "../pages/mydrinks.html";
  backLink.className = "main__back-link mx-5 fs-3";
  backLink.innerHTML = `<i class="bi bi-arrow-left fs-4 text-white"></i>`;
  document.querySelector(".main").prepend(backLink);

  document.getElementById("linkAdd").classList.remove("active");
  document.querySelector(".add__form-submit").textContent = "Save";
  document.querySelector(".main__header-title").textContent = "Edit Drink";
  editDrink(drinkID);
} else {
  inputs.forEach((input) => {
    window.localStorage.removeItem(input.id);
  });
}
//
form.addEventListener("submit", (event) => {
  event.preventDefault();
  if (document.querySelector(".add__form-submit").textContent === "Save") {
    Swal.fire({
      title: "Do you want to save your changes?",
      showCancelButton: true,
      confirmButtonText: "Yes, save it!",
      customClass: {
        confirmButton: "my-confirm-btn",
        cancelButton: "my-cancel-btn",
        title: "my-black-title",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        const drink = myDrinks.find((drink) => +drink.id === +drinkID);
        inputs.forEach((input, index) => {
          let value = input.value.trim();
          if (!input.classList.contains("ingredient")) {
            if (value === "") {
              flag = false;
            } else {
              if (input.id === "name") drink.name = value;
              if (input.id === "category") drink.category = value;
              if (input.id === "image") {
                // src : imageBase64
                drink.image = window.localStorage.getItem(input.id);
              }
              let arrayOfIngredient =
                JSON.parse(localStorage.getItem("ingredients")) || [];
              drink.ingredients = arrayOfIngredient;
              if (input.id === "instructions") drink.instructions = value;
            }
          }
        });
        window.localStorage.setItem("myDrinks", JSON.stringify(myDrinks));
        inputs.forEach((input) => {
          window.localStorage.removeItem(input.id);
        });
        //
        // تحديث likedDrinks إذا كان المشروب موجود فيه
        let likedDrinks = JSON.parse(localStorage.getItem("likedDrinks")) || [];
        const likedIndex = likedDrinks.findIndex(
          (drink) => +drink.id === +drinkID
        );
        if (likedIndex !== -1) {
          likedDrinks[likedIndex] = { ...drink, state: true };
          localStorage.setItem("likedDrinks", JSON.stringify(likedDrinks));
        }
        //
        clearForm();
        const Toast = Swal.mixin({
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
          },
        });
        Toast.fire({
          icon: "success",
          title: "Removed from favorites",
        });
      }
    });
    return;
  }
  let values = [];
  let drink = {};
  let flag = true;
  inputs.forEach((input, index) => {
    let value = input.value.trim();
    if (!input.classList.contains("ingredient")) {
      if (value === "") {
        flag = false;
      } else {
        if (input.id === "name") drink.name = value;
        if (input.id === "category") drink.category = value;
        if (input.id === "image") {
          // src : imageBase64
          drink.image = window.localStorage.getItem(input.id);
        }
        let arrayOfIngredient =
          JSON.parse(localStorage.getItem("ingredients")) || [];
        drink.ingredients = arrayOfIngredient;
        if (input.id === "instructions") drink.instructions = value;
      }
    }
  });

  drink.id = lengthOfAllDrinks;
  lengthOfAllDrinks++;
  window.localStorage.setItem("lengthOfAllDrinks", lengthOfAllDrinks);

  if (flag) {
    const Toast = Swal.mixin({
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
      },
    });
    Toast.fire({
      icon: "success",
      title: "Drink added successfully!",
    });
    let MyDrinks = JSON.parse(window.localStorage.getItem("myDrinks")) || [];
    MyDrinks.push(drink);
    window.localStorage.setItem("myDrinks", JSON.stringify(MyDrinks));
    clearForm();
  }
});

const ParentsOfIngredients = document.querySelector(".add__form--ingredients");
let allIngredients = document.querySelectorAll(".ingredient");
let addRow = document.querySelector(".addrow");

// remove error icon and error outline when start write in input
// save values to storage
inputs.forEach((input, index) => {
  input.addEventListener("input", () => {
    if (input.id === "image") {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = function () {
        window.localStorage.setItem(input.id, reader.result);
      };
      if (file) {
        reader.readAsDataURL(file);
      }
    } else if (input.id !== "ingredients") {
      window.localStorage.setItem(input.id, input.value);
    }
  });
});

window.addEventListener("load", () => {
  setValuesInInput();
});

// add row to increase ingredients
addRow.addEventListener("click", createInputs);

// هون بنشألي الانبوت
function createInputs() {
  const input = document.createElement("input");
  input.type = "text";
  input.classList.add("add__form-input", "p-2", "mb-1", "ingredient");

  input.addEventListener("input", updateIngredientsStorage);
  ParentsOfIngredients.appendChild(input);
  return input;
}

function updateIngredientsStorage() {
  allIngredients = document.querySelectorAll(".ingredient");
  let array = [...allIngredients].map((el) => el.value.trim());
  array = array.filter((value) => value !== "");
  array = [...new Set(array)];
  localStorage.setItem("ingredients", JSON.stringify(array));
}

// localStorage.clear();

function editDrink(id) {
  const drink = myDrinks.find((drink) => +drink.id === +id);
  const { name, category, image, ingredients, instructions } = drink;
  localStorage.setItem("name", name);
  localStorage.setItem("category", category);
  localStorage.setItem("instructions", instructions);
  localStorage.setItem("image", image);
  localStorage.setItem("ingredients", JSON.stringify(ingredients));
}

function clearForm() {
  inputs.forEach((input) => {
    input.value = "";
  });
  window.localStorage.removeItem("countOfRows");
  window.localStorage.removeItem("ingredients");
  ParentsOfIngredients.innerHTML = `
        <label for="ingredients" class="add__form-label mb-3"
              >Ingredients :
        </label>
        <i class="bi bi-plus addrow" role="button" aria-label="add row"></i>
  `;
  addRow = document.querySelector(".addrow");
  addRow.addEventListener("click", createInputs);
  let firstInput = createInputs();
  firstInput.id = "ingredients";
  firstInput.required = true;
}

function setValuesInInput() {
  inputs.forEach((input) => {
    if (input.id === "image") {
      const savedImageBase64 = window.localStorage.getItem(input.id);
      if (savedImageBase64) {
        fetch(savedImageBase64)
          .then((res) => res.blob())
          .then((blob) => {
            const file = new File([blob], "saved-image.jpeg", {
              type: blob.type,
            });
            const dataTransfer = new DataTransfer();
            dataTransfer.items.add(file);
            input.files = dataTransfer.files;
          });
      }
    } else if (!input.classList.contains("ingredient")) {
      input.value = window.localStorage.getItem(input.id);
    }
  });

  if (allIngredients[0].id === "ingredients") {
    allIngredients[0].addEventListener("input", updateIngredientsStorage);
  }

  const ingredients =
    JSON.parse(window.localStorage.getItem("ingredients")) || [];
  if (ingredients[0]) {
    allIngredients[0].value = ingredients[0];
  }
  for (let i = 1; i < ingredients.length; i++) {
    const input = createInputs();
    input.value = ingredients[i];
  }
}
