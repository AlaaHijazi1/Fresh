const inputs = document.querySelectorAll(".add__form-input");

const form = document.querySelector(".add__form");
const iconError = document.querySelectorAll(".add__form-error");

let lengthOfAllDrinks = +window.localStorage.getItem("lengthOfAllDrinks");
const myDrinks = JSON.parse(window.localStorage.getItem("myDrinks"));

/*
  Here we check the URL search parameters for "editId" to determine
  if the page is in edit mode or add mode.
  - If "editId" exists, it means we're editing an existing drink:
  - If "editId" does not exist, it means we're adding a new drink:
*/
const params = new URLSearchParams(window.location.search);
const drinkID = params.get("editId");

if (drinkID) {
  sessionStorage.setItem("mode", "edit");
} else {
  sessionStorage.setItem("mode", "add");
}

const mode = sessionStorage.getItem("mode");

if (mode === "edit" && drinkID) {
  const backLink = document.createElement("a");
  backLink.href = "../pages/mydrinks.html";
  backLink.className = "main__back-link mx-5 fs-3";
  backLink.innerHTML = `<i class="bi bi-arrow-left fs-4 text-white"></i>`;
  document.querySelector(".main").prepend(backLink);

  document.getElementById("linkAdd").classList.remove("active");
  document.querySelector(".add__form-submit").textContent = "Save";
  document.querySelector(".main__header-title").textContent = "Edit Drink";
  if (
    !sessionStorage.getItem("name") &&
    !sessionStorage.getItem("category") &&
    !sessionStorage.getItem("instructions") &&
    !sessionStorage.getItem("image") &&
    !sessionStorage.getItem("ingredients")
  ) {
    editDrink(drinkID);
  }
} else if (mode === "add") {
  // Here we check if the user came from the edit page
  const cameFromEdit = sessionStorage.getItem("cameFromEdit");

  if (cameFromEdit === "true") {
    /* If we came from edit mode, remove old form data from sessionStorage
     so it doesn’t show up in the add drink form */
    clearSessionStorageForForm();
    sessionStorage.removeItem("cameFromEdit");
  }

  // Check if any input field has saved (non-empty) data in sessionStorage
  const hasUserInput = [...inputs].some((input) =>
    sessionStorage.getItem(input.id)?.trim()
  );

  const ingredients = JSON.parse(sessionStorage.getItem("ingredients")) || [];

  if (!hasUserInput && ingredients.length === 0) {
    clearSessionStorageForForm();
  }
}

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
        inputs.forEach((input) => {
          updateDrinkFromInputs(input, drink);
        });
        window.localStorage.setItem("myDrinks", JSON.stringify(myDrinks));
        inputs.forEach((input) => {
          window.localStorage.removeItem(input.id);
        });
        // Update likedDrinks if the drink already exists in it
        let likedDrinks = JSON.parse(localStorage.getItem("likedDrinks")) || [];
        const likedIndex = likedDrinks.findIndex(
          (drink) => +drink.id === +drinkID
        );
        if (likedIndex !== -1) {
          likedDrinks[likedIndex] = { ...drink, state: true };
          localStorage.setItem("likedDrinks", JSON.stringify(likedDrinks));
        }
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
    sessionStorage.removeItem("cameFromEdit");
    return;
  }
  let drink = {};
  let flag = true;
  inputs.forEach((input) => {
    updateDrinkFromInputs(input, drink);
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
    let MyDrinksFromStorage =
      JSON.parse(window.localStorage.getItem("myDrinks")) || [];
    MyDrinksFromStorage.push(drink);
    window.localStorage.setItem(
      "myDrinks",
      JSON.stringify(MyDrinksFromStorage)
    );
    clearForm();
  }
});

function updateDrinkFromInputs(input, drink) {
  let value = input.value.trim();
  if (!input.classList.contains("ingredient")) {
    if (value === "") {
      flag = false;
    } else {
      if (input.id === "name") drink.name = value;
      if (input.id === "category") drink.category = value;
      if (input.id === "image") {
        // src : imageBase64
        drink.image = window.sessionStorage.getItem(input.id);
      }
      let arrayOfIngredient =
        JSON.parse(sessionStorage.getItem("ingredients")) || [];
      drink.ingredients = arrayOfIngredient;
      if (input.id === "instructions") drink.instructions = value;
    }
  }
}

// Save each input field’s value to localStorage so they remain filled after page reload
inputs.forEach((input) => {
  input.addEventListener("input", () => {
    if (input.id === "image") {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = function () {
        window.sessionStorage.setItem(input.id, reader.result);
      };
      if (file) {
        reader.readAsDataURL(file);
      }
    } else if (input.id !== "ingredients") {
      window.sessionStorage.setItem(input.id, input.value);
    }
  });
});

window.addEventListener("load", () => {
  setValuesInInput();
});
// On page reload, retrieve input values from localStorage and refill the form fields
let allIngredients = document.querySelectorAll(".ingredient");
function setValuesInInput() {
  inputs.forEach((input) => {
    if (input.id === "image") {
      const savedImageBase64 = window.sessionStorage.getItem(input.id);
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
      input.value = window.sessionStorage.getItem(input.id);
    }
  });

  if (allIngredients[0].id === "ingredients") {
    allIngredients[0].addEventListener("input", updateIngredientsStorage);
  }

  const ingredients =
    JSON.parse(window.sessionStorage.getItem("ingredients")) || [];
  if (ingredients[0]) {
    allIngredients[0].value = ingredients[0];
  }
  for (let i = 1; i < ingredients.length; i++) {
    const input = createInputs();
    input.value = ingredients[i];
  }
}

// add row to increase ingredients
let addRow = document.querySelector(".addrow");
addRow.addEventListener("click", createInputs);

// Here we create an input for each ingredient to be added
const ParentsOfIngredients = document.querySelector(".add__form--ingredients");
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
  sessionStorage.setItem("ingredients", JSON.stringify(array));
}

function editDrink(id) {
  const drink = myDrinks.find((drink) => +drink.id === +id);
  const { name, category, image, ingredients, instructions } = drink;
  sessionStorage.setItem("name", name);
  sessionStorage.setItem("category", category);
  sessionStorage.setItem("instructions", instructions);
  sessionStorage.setItem("image", image);
  sessionStorage.setItem("ingredients", JSON.stringify(ingredients));
}

function clearForm() {
  inputs.forEach((input) => {
    window.sessionStorage.removeItem(input.id);
    input.value = "";
  });
  window.localStorage.removeItem("countOfRows");
  window.sessionStorage.removeItem("ingredients");
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

function clearSessionStorageForForm() {
  inputs.forEach((input) => {
    sessionStorage.removeItem(input.id);
  });
  sessionStorage.removeItem("ingredients");
}
