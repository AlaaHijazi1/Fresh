/*
When displaying the drink page, it could be accessed from the liked drinks page,
all drinks page, or my drinks page. To ensure we return to the correct page,
we store the source page in localStorage.
*/
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

export function updateDrinksCount(cards, length, Message) {
  const quantity = document.getElementById("quantity");
  quantity.textContent = `${length} Drinks Found`;
  if (length === 0) {
    cards.innerHTML = `
  <div class="w-100 text-center mt-5">
    <h5>${Message}</h5>
  </div>
`;
  }
}
