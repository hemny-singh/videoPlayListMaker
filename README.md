# About Project

Simple project to make your own playlist. Which has following features: 
* User can add multiple YouTube videos to their playlist by providing youtube id, url, start time, end time, title.
* Video plays automatically once current one ends.
* Muliple user support.

## Solution

Using localstorage to save user and their playlist as server code is not added.

### Tech stack

* AngularJS
* HTML5
* SASS
* Youtue iframe API
* gulp
* npm and bower

### Angular Conventions
* Directive to add generic template code or DOM manipulation.
* Services to write the generic logic to set and get the data.
* Controllers have business logic and view binding code.
* Teardown the listeners before controllers are destroyed.


### To setup local environment
1. Run ```sudo npm install```
2. Install Bower if not installed ```npm install bower -g```
3. Run ```bower install bower.json```
4. Select 2 (optional)

### To run server locally
1. Run ```gulp server```
2. Open [http://localhost:8000](http://localhost:8000) in your browser..


### Additional commands
1. Run ```gulp``` to make dist directory
2. Run ```gulp scripts``` to lint all javascript files


