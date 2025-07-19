/* Here, I want to get the source page where this drink was clicked from,
   so that when I go back, I can return to the same page it came from
*/
const sourcePage = window.localStorage.getItem("page");
let allDrinks = "";
switch (sourcePage) {
  case "mydrinks.html":
    allDrinks = JSON.parse(localStorage.getItem("myDrinks")) || [];
    break;
  case "alldrinks.html":
    allDrinks = JSON.parse(localStorage.getItem("allDrinks")) || [];
    break;
  case "likeddrinks.html":
    allDrinks = JSON.parse(localStorage.getItem("likedDrinks")) || [];
    break;
  default:
    allDrinks = [];
    break;
}

const id = +window.localStorage.getItem("selectedDrinkId");

const drink = allDrinks.find((drink) => +id === drink.id);
const information = document.querySelector(".drinks");

const link = document.querySelector(".main__back-link");
link.setAttribute("href", sourcePage);

information.innerHTML = `
        <div class="drinks__allsections p-5">
          <div class="d-flex justify-content-center">
            <h2 class="drinks__allsections-title text-center p-3 mb-4 w-50">
              Drink Details
            </h2>
          </div>
          <div class="drinks__allsections-firstsection p-4">
            <div class="drinsk__image w-50">
              <img
                class="drinks__image"
                src="${drink.image}"
                alt="drink image"
                width="90%"
              />
            </div>
            <div class="drinsk__info d-flex flex-column justify-content-center">
              <h3 class="drinks__info-name">${drink.name}</h3>
              <h6 class="drinks__info-category p-3 text-center">${
                drink.category
              }</h6>
            </div>
          </div>
          <div class="drinks__allsections-secondsection p-4 mt-4">
            <h2 class="drinks__Ingredients p-1">Ingredients :</h2>
            <table class="table table-bordered">
              <tr>
                <th scope="col">#</th>
                <th scope="col">ingredient</th>
              </tr>
              ${createRows(drink.ingredients)}
            </table>
          </div>
          <div class="drinks__allsections-secondsection p-4 mt-4">
            <h2 class="drinks__Instructions p-1">Instructions :</h2>
            <p class="p-1 fs-5">${drink.instructions}</p>
          </div>
        </div>

`;

function createRows(ingredients) {
  return ingredients
    .map(
      (item, index) => `
  <tr>
  <td>${index + 1}</td>
  <td>${item}</td>
  <tr>`
    )
    .join("");
}
