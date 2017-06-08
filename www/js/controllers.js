angular.module('songhop.controllers', ['ionic', 'songhop.services'])


/*
Controller for the discover page
*/
.controller('DiscoverCtrl', function($scope, $ionicLoading, $timeout, User, Recommendations) {

 var showLoading = function() {
    $ionicLoading.show({
      template: '<i class="ion-loading-c"></i>',
      noBackdrop: true
    });
  }

  var hideLoading = function() {
    $ionicLoading.hide();
  }

  // set loading to true first time while we retrieve songs from server.
  showLoading();

    Recommendations.init()
    .then(function(){

      $scope.currentSong = Recommendations.queue[0];

      return Recommendations.playCurrentSong();

    })
    .then(function(){
      // turn loading off
      hideLoading();
      $scope.currentSong.loaded = true;
    });

  
 $scope.sendFeedback = function (bool) {

    // first, add to favorites if they favorited
    if (bool) User.addSongToFavorites($scope.currentSong);

    // set variable for the correct animation sequence
    $scope.currentSong.rated = bool;
    $scope.currentSong.hide = true;

    // prepare the next song
    Recommendations.nextSong();

    // update current song in scope, timeout to allow animation to complete
    $timeout(function() {
      $scope.currentSong = Recommendations.queue[0];
      $scope.currentSong.loaded = false;
    }, 250);

    Recommendations.playCurrentSong().then(function() {
      $scope.currentSong.loaded = true;
    });

  }

      $scope.nextAlbumImg = function() {
    if (Recommendations.queue.length > 1) {
      return Recommendations.queue[1].image_large;
    }

    return '';
  }

})


/*
Controller for the favorites page
*/
.controller('FavoritesCtrl', function($scope, User, $window) {
  $scope.username = User.username;
	$scope.favorites = User.favorites;
	$scope.removeSong = User.removeSongFromFavorites;

    $scope.openSong = function(song) {
    $window.open(song.open_url, "_system");
  }
  
})

.controller('SplashCtrl', function($scope, $state, User) {
   $scope.submitForm = function(username, signingUp) {
    User.auth(username, signingUp).then(function(){
      // session is now set, so lets redirect to discover page
      $state.go('tab.discover');

    }, function() {
      // error handling here
      alert('Hmm... try another username.');

    });
  }

})


/*
Controller for our tab bar
*/
.controller('TabsCtrl', function($scope, User, Recommendations, $window) {
 $scope.favCount = User.favoriteCount;

    $scope.enteringFavorites = function() {
    User.newFavorites = 0;
    Recommendations.haltAudio();
  }
    $scope.leavingFavorites = function() {
    Recommendations.init();
  }
    $scope.logout = function() {
    User.destroySession();

    // instead of using $state.go, we're going to redirect.
    // reason: we need to ensure views aren't cached.
    $window.location.href = 'index.html';
  }
});