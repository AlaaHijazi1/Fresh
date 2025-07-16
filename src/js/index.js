const reasons = document.querySelector(".main__reasons");

const Objects = [
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

  Objects.forEach((reason) => {
    const div = document.createElement("div");
    div.classList.add("main__reason");

    const icon = document.createElement("i");
    icon.classList.add("bi", reason.icon);
    div.appendChild(icon);

    const h3 = document.createElement("h3");
    h3.classList.add("main__title");
    h3.textContent = reason.title;
    div.appendChild(h3);

    const p = document.createElement("p");
    p.classList.add("main__text");
    p.textContent = reason.Text;
    div.appendChild(p);

    reasons.appendChild(div);
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
