"use strict";

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */

function navAllStories(evt) {
  console.debug("navAllStories", evt);
  hidePageComponents();
  putStoriesOnPage();
}

$body.on("click", "#nav-all", navAllStories);

/** Show login/signup on click on "login" */

function navLoginClick(evt) {
  console.debug("navLoginClick", evt);
  hidePageComponents();
  $loginForm.show();
  $signupForm.show();
}

$navLogin.on("click", navLoginClick);

/** When a user first logins in, update the navbar to reflect that. */

function updateNavOnLogin() {
  console.debug("updateNavOnLogin");
  //$(".main-nav-links").show();
  $idNavSubmitNewStory.show();
  $idNavShowFavoriteStories.show();
  $idNavShowOwnedStories.show();

  $navLogin.hide();
  $navLogOut.show();
  $navUserProfile.text(`${currentUser.username}`).show();
}

//JL: subpart 2B, add new story

function navSubmitNewStory(evt){
  console.debug("navSubmitNewStory", evt);
  hidePageComponents();//JL: in main.js
  $allStoriesList.show();
  $idFormNewStory.show();
}
$idNavSubmitNewStory.on("click", navSubmitNewStory);

/*
JL: Subpart 3A: Data/API Changes; favorites
*/

function navShowFavoriteStories(evt) {
  console.debug("navShowFavoriteStories", evt);
  hidePageComponents();//JL: in main.js
  showFavoriteStories();//JL: in stories.js
}
$idNavShowFavoriteStories.on("click", navShowFavoriteStories);

/*
JL: show user's created stories
*/

function navShowUserCreatedStories(evt) {
  console.debug("navShowUserCreatedStories", evt);
  hidePageComponents();//JL: in main.js

  $idFavoriteStories.hide();
  showUserCreatedStories();//JL: in stories.js
}
$idNavShowOwnedStories.on("click", navShowUserCreatedStories);