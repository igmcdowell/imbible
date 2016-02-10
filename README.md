## Getting started

### Install Global Dependencies
- Install node through nvm. See https://github.com/creationix/nvm
- Install babel
`npm install --global babel-cli`
- Install gulp
`npm install --global gulp`
- install npm-shrinkwrap
`npm install -g npm-shrinkwrap`

### Install Project Dependencies
`npm install`

### Start build process/server
`gulp`

### Server-side Debugging
Node-inspector looks/works a lot like the chrome inspector, and makes it significantly easier to debug node.

- Make sure you have node-inspector installed
`npm install -g node-inspector`
- Start build process/server in debug mode
`gulp --debug`
- Start node-inspector (it should attach to the running node process)
`node-debug`

### Sublime Text Setup
* Add Package Control by following `https://sublime.wbond.net/installation`
* Add packages via Package Control `cmd + shift + p`
    - SublimeGit 
    - Fix Mac Path
    - Babel
    - SCSS
* Optional Packages
    - BracketHiglighter
    - GitGutter
    - GotoRowCol

* Add to sublime settings:
    "tab_size": 2,
    "translate_tabs_to_spaces": true
* Optional sublime settings (prevent built stuff from showing up in your search):
  "binary_file_patterns":
    [
      "node_modules/*",
      "public/js/bundle*",
      "public/js/common*",
      "public/style/addons*",
      "public/style/app*"
    ]

### Dev Environment Additions
#### Git hooks
- Add a pre-commit hook for `shrinkwrap`
    - `touch .git/hooks/pre-commit`
    - `chmod +x !$`
    - Add this to the newly created file
        ```
        #!/bin/sh

        if ( git diff --cached --name-status | grep -q '[[:blank:]]package.json' ) && ! ( git diff --cached --name-status | grep -q npm-shrinkwrap.json ); then
            echo "Running shrinkwrap and adding new npm-shrinkwrap.json to staged files"
            npm shrinkwrap --dev
            git add ./npm-shrinkwrap.json
        fi
        ```

## Helpful development stuff

- Ignore node_modules and bundles in sublime text search
`Sublime Text -> Preferences -> Settings - User`
`"binary_file_patterns":
 [
   "node_modules/*",
   "public/js/bundle.js",
   "public/lib/common.js"
 ],`
- Install react developer tools for chrome
`https://github.com/facebook/react-devtools`
