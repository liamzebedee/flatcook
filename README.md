flatcook
========

Copyright 2015 Liam Edwards-Playne and Nathan Wilson.



Ionic/Angular notes:


  With the new view caching in Ionic, Controllers are only called
  when they are recreated or on app start, instead of every page change.
  To listen for when this page is active (for example, to refresh data),
  listen for the $ionicView.enter event:

http://mcgivery.com/ionic-master-detail-pattern/