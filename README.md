# First time Setup
## install node nvm and v14.5.1
nvm: https://github.com/nvm-sh/nvm#installing-and-updating

```
nvm install 14.5.1
```

## install yarn
https://classic.yarnpkg.com/en/docs/install#mac-stable

## install dependencies
```
yarn install
```

# Developing
## Stand up a localhost server:
```
cd dev
python -m SimpleHTTPServer 8000
```

## Start the dev build with watch:
```
yarn dev --watch --progress
```

## Make changes/test
Check your changes at localhost:8000. You will need to refresh after a rebuild (not hot reloading)

No test suite here, so try not to break things. If you really want to you can add a jest suite or something.

# Building for distribution
```
yarn build
```

# Updating drinks
This part is obnoxious. 
## Overview
The drinks are defined in scripts/drinks.tsv. The format is:
```
Source Book Prefix + Drink Name | Drink Name | Source Book Full Name | Ingredient Name | quantity | unit
```
Notes: 
- We use TSV format because it's driven by a Google sheet. At some point would be nice to stuff this in a database and skip the whole parsing nonsense, but this is the army we have.
- The name is duplicated so different recipes with the same name each get their own entry. 
- Quantity and unit are currently not consumed by the script, since the data is all missing.
- There's one complete line per ingredient.

There is a separate sheet that must be kept in sync - ingredients.tsv. 
ingredients.tsv allows relating a very specific ingredient to more general categories. The format is: 

```
Ingredient Name | Ingredient Type | Ingredient Super Type
```

e.g. 
```
Beefeater London Dry Gin  Gin
```

Ingredient Type is required. The super type is optional.

## Adding drinks
Make your changes in the source google sheet, then export the TSV data and overwrite drinks.tsv
If your drink uses a new ingredient, you must add a row to ingredients.tsv.

Once the source data is updated, you need to generate data

```
yarn generate-data
```

## Updating data generation logic
Make all changes to scripts/ingredient-parser.ts. Don't touch ingredient-parser.js, that's generated code.

Once you make a change to the data generation script, you need to recompile it
```
yarn compile-data-script
```

You will probably then also want to regenerate data
```
yarn generate-data
```