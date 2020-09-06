var menuButton = document.querySelector(".page-header__navigation-toggle");
var menu = document.querySelector(".page-header__main-navigation");
var header = document.querySelector(".page-header")

menuButton.addEventListener("click", function (evt) {
  evt.preventDefault();

  menuButton.classList.toggle("page-header__navigation-toggle--open");
  menuButton.classList.toggle("page-header__navigation-toggle--closed");

  menu.classList.toggle("page-header__main-navigation--open");
  menu.classList.toggle("page-header__main-navigation--closed");

  header.classList.toggle("page-header--open");
  header.classList.toggle("page-header--closed");
})
