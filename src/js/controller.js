import 'core-js/stable';
import 'regenerator-runtime/runtime';
import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/sarchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookMarksView from './views/bookMarksView.js';
import addRecipeView from './views/addRecipeView.js';
import { MODAL_CLOSE_SEC } from './config.js';

// if (module.hot) {
//   module.hot.accept();
// }

// const recipeContainer = document.querySelector('.recipe');

// NEW API URL (instead of the one shown in the video)
// https://forkify-api.jonas.io

///////////////////////////////////////

// console.log('test');

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);
    // console.log(id);
    if (!id) return;
    //loading recipe
    recipeView.renderSpinner();
    // debugger;
    // resultsView.render(model.getSearchResultsPage());
    resultsView.update(model.getSearchResultsPage());
    bookMarksView.update(model.state.bookmarks);

    await model.loadRecipe(id);
    // const { recipe } = model.state;
    // console.log(recipe);
    //
    //rendering recipe
    // debugger;
    recipeView.render(model.state.recipe);
    // debugger;
    // bookMarksView.update(model.state.bookmarks);
  } catch (error) {
    console.error(error);
    recipeView.renderError();
  }
};

const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();

    const query = searchView.getQuery();

    if (!query) return;
    // console.log(query);

    await model.loadSearchResults(query);
    // console.log(model.state.search.results);

    // resultsView.render(model.state.search.results);
    resultsView.render(model.getSearchResultsPage());

    paginationView.render(model.state.search);
  } catch (error) {
    recipeView.renderError();
  }
};
// controlSearchResults();
// controlRecipes();

const controlPagination = function (gotoPage) {
  // console.log(gotoPage);
  resultsView.render(model.getSearchResultsPage(gotoPage));

  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  model.updateServings(newServings);

  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};

controlAddBookMark = function () {
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  recipeView.update(model.state.recipe);

  bookMarksView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  bookMarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  console.log(newRecipe, 'this is newwwwwwww');
  try {
    addRecipeView.renderSpinner();

    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe, 'recipeeeeeeee');

    recipeView.render(model.state.recipe);

    addRecipeView.renderMessage();

    bookMarksView.render(model.state.bookmarks);

    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    setTimeout(() => {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    console.error(err);
    addRecipeView.renderError(err.message);
  }
};

const init = function () {
  bookMarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServing(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookMark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};
init();
// window.addEventListener('hashchange', showRecipe);
