import { search, setupDrinkLinksNavigation } from "./search.js";

const cards = document.getElementById("cards");

async function get() {
  try {
    const response = await fetch("../../data/drinks.json");
    const data = await response.json();
    const myDrinks = JSON.parse(window.localStorage.getItem("myDrinks")) || [];
    let allDrinks = [...data, ...myDrinks];

    const LikedDrinkFromStorage =
      JSON.parse(window.localStorage.getItem("likedDrinks")) || [];

    allDrinks = allDrinks.map((drink) => {
      const like = LikedDrinkFromStorage.find((item) => item.id === drink.id);
      return { ...drink, state: like ? like.state : false };
    });

    window.localStorage.setItem("allDrinks", JSON.stringify(allDrinks));

    window.localStorage.setItem("lengthOfAllDrinks", allDrinks.length);
    const quantity = document.getElementById("quantity");
    quantity.textContent = `${allDrinks.length} Drinks Found`;

    cards.innerHTML = "";
    allDrinks.forEach((element) => {
      showDrinks(element, cards, allDrinks);
    });
    search(allDrinks, cards, showDrinks);
  } catch (error) {
    console.log(error);
  }
}

window.addEventListener("load", get);

function showDrinks(element, cards, allDrinks) {
  const { name, image, id, state } = element;
  const Liked = state ? "bi-heart-fill" : "bi-heart";
  const card = `
          <div
            class="col-12 col-md-6 col-lg-4  mb-4 d-flex justify-content-center"
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
                  <i class="bi ${Liked} card__icons-like mx-2" role="button"  data-id="${id}"></i>
                </div>
              </div>
            </div>
          </div>
      `;
  cards.innerHTML += card;

  setupDrinkLinksNavigation("alldrinks.html");

  const icons = document.querySelectorAll(".card__icons-like");
  icons.forEach((icon) => {
    icon.addEventListener("click", () => {
      icon.classList.toggle("bi-heart");
      icon.classList.toggle("bi-heart-fill");
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

      if (icon.classList.contains("bi-heart-fill")) {
        Toast.fire({
          icon: "success",
          title: "Added to your favorites!",
        });
      } else {
        Toast.fire({
          icon: "success",
          title: "Removed from favorites",
        });
      }
      const id = icon.dataset.id;
      allDrinks = allDrinks.map((drink) => {
        if (+id === drink.id) {
          return {
            ...drink,
            state: icon.classList.contains("bi-heart-fill"),
          };
        }
        return drink;
      });
      const favDrinks = allDrinks.filter((drink) => drink.state);
      const likedDrinks =
        JSON.parse(window.localStorage.getItem("likedDrinks")) || [];
      window.localStorage.setItem("likedDrinks", JSON.stringify(favDrinks));
      window.localStorage.setItem("allDrinks", JSON.stringify(allDrinks));
      search(allDrinks, cards, showDrinks);
    });
  });
}
