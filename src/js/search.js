export function search(allDrinks, cards, showDrinks) {
  const search = document.getElementById("search");
  const form = document.getElementById("form");
  search.addEventListener("input", () => {
    if (search.value.trim() === "") {
      renderDrinks(allDrinks);
    }
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const value = search.value.toLowerCase().trim();
    if (value) {
      const names = allDrinks.map((drink) => drink.name.toLowerCase());
      if (names.includes(value)) {
        const category = document
          .querySelector(".form-select")
          .value.toLowerCase();
        let filteredDrink = allDrinks.filter((drink) => {
          const matchesName = drink.name.toLowerCase() === value;
          const matchesCategory =
            category === "all" || drink.category.toLowerCase() === category;
          return matchesName && matchesCategory;
        });
        if (filteredDrink.length > 0) {
          renderDrinks(filteredDrink);
        } else {
          showNoDrinksFoundMessage();
        }
      } else {
        showNoDrinksFoundMessage();
      }
    }
  });

  function renderDrinks(drinksToRender) {
    cards.innerHTML = "";
    drinksToRender.forEach((element) => {
      showDrinks(element, cards, allDrinks);
    });
  }
}

export function setupDrinkLinksNavigation(page) {
  const links = document.querySelectorAll(".card__link-show");
  links.forEach((link) => {
    link.addEventListener("click", (event) => {
      localStorage.setItem("selectedDrinkId", link.dataset.id);
      localStorage.setItem("page", page);
      window.location.href = "../pages/seeinstractions.html";
    });
  });
}

function showNoDrinksFoundMessage() {
  cards.innerHTML = `
    <div class="w-100 text-center mt-5">
      <h4>No drinks found!</h4>
    </div>
  `;
}
