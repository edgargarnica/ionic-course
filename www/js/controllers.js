angular.module('songhop.controllers', ['ionic', 'songhop.services'])


/*
Controller for the discover page
*/
.controller('DiscoverCtrl', function($scope, $timeout, User, Recommendations) {
    Recommendations.getNextSongs()
    .then(function(){
      $scope.currentSong = Recommendations.queue[0];
    });




    $scope.sendFeedback = function (bool) {
    if (bool) User.addSongToFavorites($scope.currentSong);

     Recommendations.nextSong();

    $timeout(function() {
      // $timeout to allow animation to complete
      $scope.currentSong = Recommendations.queue[0];
    }, 250);
  }
})


/*
Controller for the favorites page
*/
.controller('FavoritesCtrl', function($scope, User) {
	$scope.favorites = User.favorites;
	$scope.removeSong = User.removeSongFromFavorites;
})


/*
Controller for our tab bar
*/
.controller('TabsCtrl', function($scope) {

});