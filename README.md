# Vue Application Framework
This is a Vue.js framework for building out interfaces for the CAES and Extension web applications.

## Development
### Clone
* In a terminal (Mac/Linux/BSD) or Node.js command prompt (Windows), navigate to the directory where you'd like to clone the repository `cd [directory path]`
* Then do `git clone git@gitlab.com:caesoit/intranet/vue-application-framework.git`
	* _Note: You may optionally pass a second parameter into this command to name the cloned folder something other than the repository name._
* Finally, change directory into the newly cloned directory. `cd vue-application-framework`

### Install Dependencies
* Inside the project directory, in your terminal issue the command `npm i`.  This will install all needed dependencies for the project, as listed inside `package.json`

### Build
* Inside the project directory, use one of the following commands to compile the code:
	* `npm run watch` to compile a development build, and to begin watching files for changes.
	* `npm run build` to compile a production build.
* Upon compilation complete, the compiled code can be found in the `dist` folder.
* Copy these files to their needed location on either the development or production server.
