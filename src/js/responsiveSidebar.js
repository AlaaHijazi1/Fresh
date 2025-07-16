const widthOfWindow = window.matchMedia("(max-width : 853px)");
const firstChild = document.querySelector(".sidebar");
const div = document.createElement("div");

div.classList.add("d-flex", "flex-column", "flex-shrink-0", "position-fixed");
const newChild_innerr = `
      <a
        href="../../index.html"
        class="d-block p-3 link-dark text-decoration-none"
        data-bs-toggle="tooltip"
        data-bs-placement="right"
        data-bs-original-title="logo"
      >
        <img src="../assest/image/logo.png" alt="logo" width="70" />
      </a>
      <ul class="nav nav-pills nav-flush flex-column mb-auto text-center">
        <li class="nav-item">
          <a href="./alldrinks.html" data-id="All Drinks" class="nav-link py-3 border-bottom" title="All Drinks">
          <i class="bi bi-cup-hot fs-3"></i></a>
        </li>
        <li>
          <a href="../../index.html" class="nav-link py-3 border-bottom" data-id="Home" title="Home">
          <i class="bi bi-house-door fs-3"></i>
          </a>
        </li>
        <li>
          <a href="./mydrinks.html" class="nav-link py-3 border-bottom" data-id="My Drinks" title="My Drinks">
          <i class="bi bi-cup fs-3"></i>
          </a>
        </li>
        <li>
          <a
            href="./likeddrinks.html" class="nav-link py-3 border-bottom" data-id="Liked Drinks" title="Favorite Drinks">
            <i class="bi bi-heart fs-3"></i>
          </a>
        </li>
        <li>
          <a
            href="./addnewdrinks.html" class="nav-link py-3 border-bottom" data-id="Add New Drink" title="Add New Drink">
            <i class="bi bi-plus-lg fs-3"></i>
          </a>
        </li>
      </ul>`;

div.innerHTML = newChild_innerr;
div.style.height = "100vh";
div.style.width = "6rem";
const main = document.querySelector(".main");
const drinks = document.querySelector(".drinks");
let links = document.querySelectorAll(".nav-link");
let activeElement_dataId = null;

widthOfWindow.addEventListener("change", updateSidebar);

window.addEventListener("load", updateSidebar);

// Rebuild the sidebar if the screen width is less than 850px

function updateSidebar() {
  if (widthOfWindow.matches) {
    firstChild.replaceWith(div);
    main.style.marginLeft = "6rem";
    drinks.style.marginTop = "1rem";
    drinks.style.setProperty("padding", "0", "important");
  } else {
    div.replaceWith(firstChild);
    main.style.marginLeft = "280px";
    drinks.style.marginTop = "0rem";
    drinks.style.padding = "3rem";
  }

  addNavLinkListeners();
  setElementActive();
}

function addNavLinkListeners() {
  links.forEach((link) => {
    link.addEventListener("click", () => {
      links.forEach((l) => {
        l.classList.remove("active");
      });
      link.classList.add("active");
    });
  });

  links.forEach((link) => {
    if (link.classList.contains("active")) {
      activeElement_dataId = link.dataset.id;
    }
  });
}

function setElementActive() {
  links = document.querySelectorAll(".nav-link");
  links.forEach((link) => {
    if (link.dataset.id === activeElement_dataId) {
      link.classList.add("active");
    }
  });
}

