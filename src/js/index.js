const reasons = document.querySelector(".main__reasons");

const reasonsData = [
  {
    icon: "bi-flower2",
    title: "100% Natural Ingredients",
    Text: "We only use fresh and natural ingredients in every drink",
  },
  {
    icon: "bi-cup-hot",
    title: "Flavor Variety",
    Text: "A wide variety of flavors to match every taste and craving",
  },
  {
    icon: "bi-heart",
    title: "Handcrafted with Love",
    Text: "Each drink is prepared carefully to give you the best flavor experience",
  },
];

window.addEventListener("load", () => {
  if (!reasons) return;

  reasonsData.forEach((reason) => {
    const { icon, title, Text } = reason;
    reasons.innerHTML += `
    <div class="main__reason">
      <i class="bi ${icon}"></i>
      <h3 class="main__title">${title}</h3>
      <p class="main__text">
        ${Text}
      </p>
    </div>
    `;
  });
});

const drink = document.getElementById("drink");
if (drink) {
  drink.addEventListener("click", () => {
    window.location.href = "../../src/pages/drinks.html";
  });
}

let nav_links = document.querySelectorAll(".nav-link");

nav_links.forEach((link) => {
  link.addEventListener("click", () => {
    nav_links.forEach((l) => {
      l.classList.remove("active");
    });
    link.classList.add("active");
  });
});
