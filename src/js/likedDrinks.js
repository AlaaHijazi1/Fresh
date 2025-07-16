import { setupDrinkLinksNavigation } from "./search.js";

const cards = document.getElementById("cards");

let likedDrinks = JSON.parse(window.localStorage.getItem("likedDrinks")) || [];
if (likedDrinks.length > 0) {
  cards.innerHTML = "";
  likedDrinks.forEach((drink) => {
    const { image, name, id } = drink;
    const card = `
          <div
            class="col-12 col-md-6 col-lg-4 mb-4 d-flex justify-content-center"
          >
            <div class="card" style="width: 100%;">
              <img
                src="${image}"
                alt="drink image"
                class="card-img-top"
                height="250"
              />
              <div class="card-body">
                <div class="name"><h5 class="card-title text-center">${name}</h5></div>
                <div
                  class="card__buttons d-flex justify-content-evenly align-items-center mt-3 p-1"
                >
                  <button class="card__link-show btn p-2" data-id="${id}">
                    see instractions
                  </button>
                  <i class="bi bi-heart-fill card__icons-like mx-2" role="button"  data-id="${id}"></i>
                </div>
              </div>
            </div>
          </div>
      `;
    cards.innerHTML += card;

    setupDrinkLinksNavigation("likeddrinks.html");

    const icons = document.querySelectorAll(".card__icons-like");
    icons.forEach((icon) => {
      icon.addEventListener("click", () => {
        Swal.fire({
          title: "Remove from favorites?",
          showCancelButton: true,
          confirmButtonText: "Yes, remove it!",
          customClass: {
            confirmButton: "my-confirm-btn",
            cancelButton: "my-cancel-btn",
            title: "my-black-title",
          },
        }).then((result) => {
          if (result.isConfirmed) {
            icon.classList.add("bi-heart");
            icon.classList.remove("bi-heart-fill");
            const id = icon.dataset.id;
            likedDrinks = likedDrinks.map((drink) => {
              if (+id === drink.id) {
                return { ...drink, state: false };
              }
              return drink;
            });
            const favDrinks = likedDrinks.filter((drink) => drink.state);
            window.localStorage.setItem(
              "likedDrinks",
              JSON.stringify(favDrinks)
            );
            icon.closest(".col-12").remove();

            likedDrinks = JSON.parse(
              window.localStorage.getItem("likedDrinks")
            );
            numberOfDrinks();
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
      });
    });
  });
} else {
  cards.innerHTML = `
  <div class="w-100 text-center mt-5">
    <h5>You have no favorite drinks yet!</h5>
  </div>
`;
}

numberOfDrinks();
function numberOfDrinks() {
  const quantity = document.getElementById("quantity");
  quantity.textContent = `${+likedDrinks.length} Drinks Found`;
  if (+likedDrinks.length === 0) {
    cards.innerHTML = `
  <div class="w-100 text-center mt-5">
    <h5>You have no favorite drinks yet!</h5>
  </div>
`;
  }
}
