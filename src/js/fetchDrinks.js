import { setupDrinkLinksNavigation } from "./drinks-utils.js";

const more_ntn = document.querySelector(".main__show-more-btn");
let allDrinks = [];

let currentIndex = 0;
const drinksPerPage = 6;

const cards = document.getElementById("cards");

async function get() {
  try {
    const response = await fetch("../../data/drinks.json");
    const data = await response.json();
    const myDrinks = JSON.parse(window.localStorage.getItem("myDrinks")) || [];
    allDrinks = [...data, ...myDrinks];
    const LikedDrinkFromStorage =
      JSON.parse(window.localStorage.getItem("likedDrinks")) || [];

    /*
  Here I'm looping through all the drinks and checking each one against the liked drinks from storage.
  If a drink with the same ID exists in the liked list and its state is true, 
  then I set the drink's state to true (it is liked). 
  Otherwise, I set the state to false.
*/
    allDrinks = allDrinks.map((drink) => {
      const like = LikedDrinkFromStorage.find((item) => item.id === drink.id);
      return { ...drink, state: like ? like.state : false };
    });

    window.localStorage.setItem("allDrinks", JSON.stringify(allDrinks));

    window.localStorage.setItem("lengthOfAllDrinks", allDrinks.length);
    const quantity = document.getElementById("quantity");
    quantity.textContent = `${allDrinks.length} Drinks Found`;

    cards.innerHTML = "";
    renderDrinksSubset();
    searchDrinks();
    setupDrinkLinksNavigation("alldrinks.html");
  } catch (error) {
    console.log(error);
  }
}

window.addEventListener("load", get);

function renderDrinksSubset() {
  const nextDrinks = allDrinks.slice(
    currentIndex,
    currentIndex + drinksPerPage
  );
  nextDrinks.forEach((element) => {
    createDrinkCard(element);
  });

  currentIndex += drinksPerPage;

  if (currentIndex >= allDrinks.length) {
    more_ntn.style.display = "none";
  } else {
    more_ntn.style.display = "block";
  }

  setupDrinkLinksNavigation("alldrinks.html");
}

more_ntn.addEventListener("click", renderDrinksSubset);

function createDrinkCard(element) {
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
}

// Toggle like/unlike for this drink (add or remove from favorites)
cards.addEventListener("click", (e) => {
  if (e.target.classList.contains("card__icons-like")) {
    e.target.classList.toggle("bi-heart");
    e.target.classList.toggle("bi-heart-fill");
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
    if (e.target.classList.contains("bi-heart-fill")) {
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
    const id = e.target.dataset.id;
    allDrinks = allDrinks.map((drink) => {
      if (+id === +drink.id) {
        return {
          ...drink,
          state: e.target.classList.contains("bi-heart-fill"),
        };
      }
      return drink;
    });
    const favDrinks = allDrinks.filter((drink) => drink.state);
    const likedDrinks =
      JSON.parse(window.localStorage.getItem("likedDrinks")) || [];
    window.localStorage.setItem("likedDrinks", JSON.stringify(favDrinks));
    window.localStorage.setItem("allDrinks", JSON.stringify(allDrinks));
  }
});

function searchDrinks() {
  const searchInput = document.getElementById("search");
  const form = document.getElementById("form");
  searchInput.addEventListener("input", () => {
    if (searchInput.value.trim() === "") {
      renderDrinks(allDrinks);
    }
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const nameDrink = searchInput.value.toLowerCase().trim();
    if (!nameDrink) return;

    const matchedDrinks = allDrinks.filter((drink) => {
      const nameMatch = drink.name.toLowerCase() === nameDrink;
      const selectedCategory = document
        .querySelector(".form-select")
        .value.toLowerCase();
      const categoryMatch =
        selectedCategory === "all" ||
        drink.category.toLowerCase() === selectedCategory;
      return nameMatch && categoryMatch;
    });

    matchedDrinks.length > 0
      ? renderDrinks(matchedDrinks)
      : showNoDrinksFoundMessage();
    more_ntn.style.display = "none";
  });
}

function renderDrinks(drinksToRender) {
  cards.innerHTML = "";
  drinksToRender.forEach((element) => {
    createDrinkCard(element);
  });
  setupDrinkLinksNavigation("alldrinks.html");
}

function showNoDrinksFoundMessage() {
  cards.innerHTML = `
    <div class="w-100 text-center mt-5">
      <h4>No drinks found!</h4>
    </div>
  `;
  more_ntn.style.display = "none";
}
