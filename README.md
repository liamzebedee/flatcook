flatcook
========

Copyright 2015 Liam Edwards-Playne and Nathan Wilson (when he adds the code he's written).

## Notes on MVC
Ionic and Angular JS is used. The model is principally kept within the Angular controller. Only modal state that is required between different controllers is implemented in the service. 


The pull-to-refresh only works when the viewport is that of a mobile size. i.e. it won't appear to work in a fullscreen desktop browser


Ionic/Angular notes:


  With the new view caching in Ionic, Controllers are only called
  when they are recreated or on app start, instead of every page change.
  To listen for when this page is active (for example, to refresh data),
  listen for the $ionicView.enter event:

http://mcgivery.com/ionic-master-detail-pattern/


Bower:

"devDependencies": {
    "ionic": "driftyco/ionic-bower#1.1.0"
  }



