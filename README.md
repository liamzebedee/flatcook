flatcook
========

http://thenextweb.com/dd/2012/02/14/googles-custom-search-api-now-supports-image-only-results/
http://www.programmableweb.com/api/ookaboo
https://developers.google.com/custom-search/json-api/v1/reference/
https://github.com/afklm/ng-lazy-image

Frontend app for Flatcook. 

Copyright 2015 Liam Edwards-Playne and Nathan Wilson (when he adds the code he's written).

## Install
 1. Install Ionic and Bower
 2. `bower install`
 3. `ionic serve`

## File structure
 - Ionic provides an MVC framework based on Angular.
 - Everything you need is generally in `www/`. There's little reason to go outside this one.
 - `www/templates/` contains the HTML views.
 - `www/js/controllers.js` and `www/js/controllers/*.js` is the controller logic that powers these views
 - `www/js/app.js` is routing and configuration (for Facebook etc.)
 - `www/js/util.js` is general-purpose utility JS code 

### services.js
`www/js/services.js` contains the code which interacts with the backend and sample data for the schema.

The controllers that power the views, they interact with the respective services to get their data asynchronously. These are the main services:
 - MealsService (cooking and eating)
 - UsersService

Services also keep their own internal state. For example, `UsersService.flatcookAPISessionKey` stores the key for authorizing against the Flatcook API. 

Services store their state locally on the device, such that when the app is restarted, we do not have to requery the server for an API key.

## Schema
As this is the only frontend, the data used in the UI is representative of the schema.

Currently, I've defined sample data in `services.js`. This data **IS NOT RELATIONAL**. The idea is, the app receives the raw blobs necessary from the backend and there is no need for multiple requests (for example, for the meal, and then for the subsequent guests of that meal).

The API calls will use a single function call, which will make tracking of which APIs we are using.

You're welcome to do whatever you want with the schema in the backend, all I care is that these API endpoints return my blobs :P.


## Random old notes on MVC
 - Ionic and Angular JS is used. The model is principally kept within the Angular controller. Only modal state that is required between different controllers is implemented in the service. 
 - The pull-to-refresh only works when the viewport is that of a mobile size. i.e. it won't appear to work in a fullscreen desktop browser
 - With the new view caching in Ionic, Controllers are only called when they are recreated or on app start, instead of every page change. To listen for when this page is active (for example, to refresh data), listen for the $ionicView.enter event: