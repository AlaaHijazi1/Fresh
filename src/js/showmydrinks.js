import {
  updateDrinksCount,
  setupDrinkLinksNavigation,
} from "./drinks-utils.js";

let myDrinks = JSON.parse(window.localStorage.getItem("myDrinks")) || [];

const cards = document.getElementById("cards");
if (myDrinks.length > 0) {
  cards.innerHTML = "";
  myDrinks.forEach((drink) => {
    createDrinkCard(drink);
  });
} else {
  cards.innerHTML = `
  <div class="w-100 text-center mt-5">
    <h4>You haven't added any custom drinks yet!</h4>
  </div>
`;
}

function createDrinkCard(element) {
  let { name, image, id } = element;
  const card = `
  <div
            class="col-12 col-md-6 col-lg-4 mb-4 d-flex justify-content-center"
          >
            <div class="card" style="width: 100%">
              <img
                src="${image}"
                alt="drink image"
                class="card-img-top"
                height="250"
              />
              <div class="card-body">
                <div class="name">
                  <h5 class="card-title text-center">${name}</h5>
                </div>
                <div
                  class="card__buttons d-flex justify-content-evenly align-items-center mt-3 p-1"
                >
                  <button class="card__link-show btn p-2" data-id="${id}">
                    see instractions
                  </button>
                  <div class="card__icons">
                    <i
                      class="bi bi-three-dots-vertical card__icons-more mx-2"
                      role="button"
                    ></i>
                    <div class="card__actions">
                      <button class="card__button" data-id="${id}">Delete</button>
                      <button class="card__button" data-id="${id}">Edit</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
      `;
  cards.innerHTML += card;
}

setupDrinkLinksNavigation("mydrinks.html");

cards.addEventListener("click", (e) => {
  if (
    e.target.classList.contains("card__button") &&
    e.target.textContent === "Delete"
  ) {
    const id = +e.target.dataset.id;
    deleteDrink(id, e.target);
  }

  if (e.target.classList.contains("card__icons-more")) {
    const icon = e.target;
    const action = icon.nextElementSibling;

    if (action.classList.contains("show")) {
      action.classList.remove("show");
      return;
    }

    document.querySelectorAll(".card__actions").forEach((action) => {
      action.classList.remove("show");
    });

    action.classList.add("show");
  }
  if (
    e.target.classList.contains("card__button") &&
    e.target.textContent === "Edit"
  ) {
    sessionStorage.clear();
    sessionStorage.setItem("cameFromEdit", "true");
    const id = +e.target.dataset.id;
    window.location.href = `../pages/addnewdrinks.html?editId=${id}`;
  }
});

// If the user clicks outside the popup, close it
document.addEventListener("click", (e) => {
  if (!e.target.closest(".card__icons")) {
    document.querySelectorAll(".card__actions").forEach((action) => {
      action.classList.remove("show");
    });
  }
});

function deleteDrink(id, button) {
  Swal.fire({
    title: "Delete this drink?",
    showCancelButton: true,
    confirmButtonText: "Yes, remove it!",
    customClass: {
      confirmButton: "my-confirm-btn",
      cancelButton: "my-cancel-btn",
      title: "my-black-title",
    },
  }).then((result) => {
    if (result.isConfirmed) {
      button.closest(".col-12").remove();
      const myDrinksAfterDeleted = myDrinks.filter((drink) => drink.id !== id);
      window.localStorage.setItem(
        "myDrinks",
        JSON.stringify(myDrinksAfterDeleted)
      );
      myDrinks = JSON.parse(window.localStorage.getItem("myDrinks"));
      updateDrinksCount(
        cards,
        myDrinks.length,
        "You haven't added any custom drinks yet!"
      );
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
        title: "Deleted successfully",
      });
    }
  });

  // If the deleted item was liked, update the liked items and remove it from the liked list
  let likedDrinks = JSON.parse(localStorage.getItem("likedDrinks")) || [];
  const likedIndex = likedDrinks.findIndex((drink) => +drink.id === +id);
  if (likedIndex !== -1) {
    likedDrinks.splice(likedIndex, 1);
    localStorage.setItem("likedDrinks", JSON.stringify(likedDrinks));
  }
}

updateDrinksCount(
  cards,
  myDrinks.length,
  "You haven't added any custom drinks yet!"
);
