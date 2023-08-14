"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */
/* 
https://fontawesome.com/icons/star?f=classic&s=regular
JL: <i class = "fa-regular fa-star"></i> // ---> not okay???
JL: need to use Vue.js syntax fas, fas ???
JL: currentUser comes from user.js!!!
*/
function generateStoryMarkup(story) {
  console.debug("generateStoryMarkup", story);
  // JL: https://fontawesome.com/icons/heart?f=classic&s=solid
  // <i class = "far fa-heart"></i>
  //debugger;
  const hostName = story.getHostName();
  return $(`
      <li id="${story.storyId}">
        ${Boolean(currentUser)?putHeartPerStory(currentUser, story):""}
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
}

//$(".story-link").style.color ="red";
//$(".story-author").style.color = "blue";
//JL

function generateOwnedStoryMarkup(story) {
  console.debug("generateOwnedStoryMarkup", story);
  // JL: https://fontawesome.com/icons/heart?f=classic&s=solid
  // <i class = "far fa-heart"></i>
  //debugger;
  const hostName = story.getHostName();
  return $(`
      <li id="${story.storyId}">
        <span class="circleMinus">
          <i class="fas fa-minus"></i>
        </span>
        ${Boolean(currentUser)?putHeartPerStory(currentUser, story):""}
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
//   return $(`
//   <li id="${story.storyId}">
//     <span class="circleMinus">
//       <i class="fas fa-minus"></i>
//     </span>
//     <a href="${story.url}" target="a_blank" class="story-link">
//       ${story.title}
//     </a>
//     <small class="story-hostname">(${hostName})</small>
//     <small class="story-author">by ${story.author}</small>
//     <small class="story-user">posted by ${story.username}</small>
//   </li>
// `);
}

function putHeartPerStory(user, story) {
  /*
  return user.isStoryFavorite(story)?
    '<i class = "fas fa-heart"></i>':
    '<i class = "far fa-heart"></i>';
    */
  let isThisStoryFavorite = user.isStoryFavorite(story);
  return `
      <span class="favHeart">
        <i class="${isThisStoryFavorite?
        "fas":"far"} fa-heart"></i>
      </span>`; 
}

/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    //$story.style.color = randomColors();
    $allStoriesList.append($story);
  }

  $allStoriesList.show();

  $idFavoriteStories.hide();//JL
  $idCreatedStories.hide();//JL
}

// JL: Subpart 2B: Building The UI for New Story Form/Add New Story

async function submitFormNewStory(event){

  event.preventDefault();

  //$idFormNewStory.slideDown(5000, "swing");//JL: effective?
  // debugger;
  const author = $('input[name="new_user"]').val();
  const title = $('input[name="new_title"]').val();
  const url = $('input[name="new_url"]').val();
  const username = currentUser.username;

  $idFormNewStory.slideDown(2000, "swing");//JL: effective?

  // const newStory = await storyList.addStory(currentUser, 
  //   {author, title, url});
  const newStory = await storyList.addStory(currentUser, 
    {author, title, url, username});
  //debugger
  const markupStory = generateStoryMarkup(newStory);
  $allStoriesList.append(markupStory);

  //JL: more to do???
  $idFormNewStory.trigger("reset");
  $idFormNewStory.slideUp(2000, "swing");//JL: effective

  $idFavoriteStories.hide();
  $idCreatedStories.hide();//JL
}

$idFormNewStory.on("submit", submitFormNewStory);

/*
JL: Subpart 3A: Data/API Changes; favorites
*/
function showFavoriteStories() {
  console.debug("showFavoriteStories");

  $idFavoriteStories.empty();

  if (currentUser.favorites.length === 0) {
    $idFavoriteStories.append("<span>No Favorite Story Existed!!! </span>");
  } else {
    for (let favStory of currentUser.favorites) {
      const $storyHTML = generateStoryMarkup(favStory);
      $idFavoriteStories.append($storyHTML);
    }
  }

  $idFavoriteStories.show();
  $idCreatedStories.hide();
}

async function changeStoryFavorateStatus(event){
  console.debug("changeStoryFavorateStatus(event)");
  //debugger;
  const $thisTarget = $(event.target);
  //ref: https://api.jquery.com/closest/
  //const $thisListItem = $thisTarget.closest("li");
  const $thisListItem = $thisTarget.parent().parent();
  const thisStoryId = $thisListItem.attr("id");
  const thisStory = storyList.stories.find(
    story => story.storyId === thisStoryId
  );
  
  const token = currentUser.loginToken;

  //ref: https://stackoverflow.com/questions/2400386/get-class-name-using-jquery

  if ($thisTarget.attr("class").indexOf("fas") > -1) {
    currentUser.favorites = 
    currentUser.favorites.filter(
      story => 
      story.storyId !== thisStory.storyId);
    const response = await axios({
      url: `${BASE_URL}/users/${currentUser.username}/favorites/${thisStory.storyId}`,
      method: "DELETE",
      data: {token},
    }); 
    //ref: http://api.jquery.com/toggleclass/
    $thisTarget.toggleClass("fas far");
  } else {
    currentUser.favorites.push(thisStory);
    const response = await axios({
      url: `${BASE_URL}/users/${currentUser.username}/favorites/${thisStory.storyId}`,
      method: "POST",
      data: {token},
    }); 
    $thisTarget.toggleClass("fas far");
  }
  
}

$classStoriesLists.on("click", ".favHeart", changeStoryFavorateStatus);
$idFavoriteStories.on("click", ".favHeart", changeStoryFavorateStatus);
$idCreatedStories.on("click", ".favHeart", changeStoryFavorateStatus);

/*
JL: Part 4: Removing Storie
*/
function showUserCreatedStories() {
  console.debug("showUserCreatedStories");

  $idCreatedStories.empty();

  if (currentUser.ownStories.length === 0) {
    $idCreatedStories.append("<span>This User Has Not Created Any Story Yet!!! </span>");
  } else {
    for (let ownStory of currentUser.ownStories) {
      const $storyHTML = generateOwnedStoryMarkup(ownStory);
      $idCreatedStories.append($storyHTML);
    }
  }

  $idCreatedStories.show();
}

async function deleteUserOwnedStory(event){
  console.debug("deleteUserOwnedStory(event)");
  //debugger;
  const $thisTarget = $(event.target);
  //ref: https://api.jquery.com/closest/
  //const $thisListItem = $thisTarget.closest("li");
  const $thisListItem = $thisTarget.parent().parent();
  const thisStoryId = $thisListItem.attr("id");
  const thisStory = storyList.stories.find(
    story => story.storyId === thisStoryId
  );
  
  const token = currentUser.loginToken;

  currentUser.ownStories = 
    currentUser.ownStories.filter(
      story => 
      story.storyId !== thisStory.storyId);
  
  currentUser.favorites = 
      currentUser.favorites.filter(
        story => 
        story.storyId !== thisStory.storyId);

  storyList.stories = 
    storyList.stories.filter(story => 
      story.storyId !== thisStory.storyId);    

  const response = await axios({
      url: `${BASE_URL}/stories/${thisStory.storyId}`,
      method: "DELETE",
      data: {token},
    }); 
}

$idCreatedStories.on("click", ".circleMinus", deleteUserOwnedStory);

function randomColors() {
  const r = Math.floor(Math.random() * 256);
  const g = 0; //Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256);
  return `rgb(${r},${g},${b})`
}