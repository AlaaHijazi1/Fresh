import { setupDrinkLinksNavigation } from "./search.js";

let myDrinks = JSON.parse(window.localStorage.getItem("myDrinks")) || [];

const cards = document.getElementById("cards");
if (myDrinks.length > 0) {
  cards.innerHTML = "";
  myDrinks.forEach((drink) => {
    showDrinks(drink, cards, myDrinks);
  });

  function showDrinks(element, cards, myDrinks) {
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
    setupDrinkLinksNavigation("mydrinks.html");
  }
} else {
  cards.innerHTML = `
  <div class="w-100 text-center mt-5">
    <h4>You haven't added any custom drinks yet!</h4>
  </div>
`;
}

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
    const id = +e.target.dataset.id;
    window.location.href = `../pages/addnewdrinks.html?editId=${id}`;
  }
});

// هون اذا كبسنا على اي اشي برا خلي يسكرها
document.addEventListener("click", (e) => {
  if (!e.target.closest(".card__icons")) {
    document.querySelectorAll(".card__actions").forEach((action) => {
      action.classList.remove("show");
    });
  }
});

//  هون بظهر البطاقة الي فهيا زر الاضفة والتعديل
// const moreIcons = document.querySelectorAll(".card__icons-more");
// const cardActions = document.querySelectorAll(".card__actions");
// moreIcons.forEach((icon) => {
//   const action = icon.nextElementSibling;

//   icon.addEventListener("click", () => {
//     if (action.classList.contains("show")) {
//       action.classList.remove("show");
//       return;
//     }
//     cardActions.forEach((card) => {
//       card.classList.remove("show");
//     });
//     action.classList.add("show");
//   });
// });
// document.addEventListener("click", (e) => {
//   if (!e.target.closest(".card__icons")) {
//     cardActions.forEach((card) => {
//       card.classList.remove("show");
//     });
//   }
// });

// هون بدي اعمل الفنكشن الخاص بالحذف
// const cardButtons = document.querySelectorAll(".card__button");
// cardButtons.forEach((button) => {
//   button.addEventListener("click", () => {
//     // button.closest(".card__actions").remove();
//     const id = +button.dataset.id;
//     deleteDrink(id, button);
//   });
// });

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
        title: "Deleted successfully",
      });
    }
  });

  let likedDrinks = JSON.parse(localStorage.getItem("likedDrinks")) || [];
  const likedIndex = likedDrinks.findIndex((drink) => +drink.id === +id);
  if (likedIndex !== -1) {
    likedDrinks.splice(likedIndex, 1);
    localStorage.setItem("likedDrinks", JSON.stringify(likedDrinks));
  }
}
// هون بزهر عدد مشورباتي
numberOfDrinks();
function numberOfDrinks() {
  const quantity = document.getElementById("quantity");
  quantity.textContent = `${+myDrinks.length} Drinks Found`;
  if (+myDrinks.length === 0) {
    cards.innerHTML = `
  <div class="w-100 text-center mt-5">
    <h4>You haven't added any custom drinks yet!</h4>
  </div>
`;
  }
}
