# CAES Presentation API
This is a Vue.js framework for building out interfaces for the CAES and Extension web applications.

## Development
### Install
* (Git)[https://git-scm.com/downloads]
* (NodeJS)[https://nodejs.org/en/]

### Clone
* In a terminal, navigate to the directory where you'd like to clone the repository
* Then do `git clone git@gitlab.com:gabeotisbenson/presentation-api.git`

### Build
* Enter the newly-cloned repository `cd presentation-api`
* Install project dependencies `npm i`
* Then, run either the development watcher script `npm run watch` or build for production `npm run build`
* A directory called `dist` will be created, and will contain three files, `bundle.js`, `bundle.js.map`, and `index.html`.  Only the two 'bundle' files matter.
* Copy the two bundle files to the singlepage location on dev `//dcifsgw/f/inetpub/wwwroot/applications/AppsSecure/GACOUNTS3/singlepage`
