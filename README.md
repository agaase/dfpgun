dfpgun
====

dfpgun is a lightweight jquery plugin to trigger google dfp ads. 
Following are the pain areas which this plugin focusses on.

1. Simplify the call of google dfp ads abstracting out the details.
2. Work in a single page style kind of an app where the data and dom is changed dynamically.
3. Provide callbacks when the ad is loaded so that user can have more control over how the ad is displayed.

####How it works?
The plugin works the same way google suggests to show dfp ads on your page. [Read here](https://support.google.com/dfp_premium/answer/3046423?hl=en). It tries to build upon it by abstracting out step 1 to 3 and allowing user to just focus on making the call with the correct ad.


####How to use it?.

1. Place an element where an ad has to be triggered in the dom. The element should cover the following requirememnts.
..1. has class - "dfpgun"
..2. data-adunit attribute set to adunit id. 
..3. data-adsize attribute set to adunit size.

Example
    <div class="dfpgun" data-adunit="/1231/samplead" data-adsize="300x250"></div>

2. In your javascript you can call the plugin passing optional parameters explained below.
    $.dfpgun(options)


####Configurational parameters.
1. callback - function to be called once the ad is loaded.
2. forceRefresh - refresh the ads if they are not triggered on first trigger. Useful in case of dynamic web apps. 


####Demos
1. [Demo1](http://agaase.github.io/webpages/imgr/demos/demo1.html)


####Installing and Building
 The dependencies and build is managed through grunt and you can use following steps to locally run grunt.
 
1. Clone the git project
2. run - npm install (installs npm dependencies)
3. run - grunt (runs jshint,cleans and builds the files under dist/).
