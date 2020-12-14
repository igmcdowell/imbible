import * as fs from 'fs';
import * as readline from 'readline';
import * as process from 'process';
// Set path for input/output files
process.chdir('scripts');
const drinksInput = 'drinks.tsv';
const ingredientsInput = 'ingredients.tsv';
const output = '../src/react/drinkData.ts';
const processRawData = function () {
    let lineNumber = 0;
    const lineReader = readline.createInterface({
        input: fs.createReadStream(ingredientsInput)
    });
    let processedData = { ingredients: [], ingredientTypes: {}, ingredientTypeIndex: 1, drinks: [] };
    lineReader.on('line', function (line) {
        lineNumber++;
        const lineData = parseIngredientLine(line, lineNumber);
        processedData = processIngredientData(lineData, processedData);
    });
    lineReader.on('close', () => {
        readDrinkInput({ processedData: normalizeIngredientTypes(processedData) });
    });
};
const readDrinkInput = function ({ processedData }) {
    const ingredientsByName = {};
    processedData.ingredients.forEach(i => ingredientsByName[i.name] = i);
    let allDrinks = [];
    const lineReader = readline.createInterface({
        input: fs.createReadStream(drinksInput)
    });
    lineReader.on('line', function (line) {
        const lineData = parseDrinkLine(line);
        processDrinkDataLine(lineData, allDrinks, ingredientsByName);
    });
    lineReader.on('close', () => {
        allDrinks.forEach(d => delete d.canonicalName);
        allDrinks.sort((d1, d2) => d1.name.localeCompare(d2.name));
        processedData.drinks = allDrinks;
        writeOutput(output, processedData);
    });
};
const processDrinkDataLine = function (drinkData, allDrinks, ingredientsByName) {
    let last = allDrinks[allDrinks.length - 1];
    if (!ingredientsByName[drinkData.ingredient]) {
        return;
    }
    const { ingredientType, ingredientSuperType, id: ingredientId } = ingredientsByName[drinkData.ingredient];
    if (!last || last.canonicalName !== drinkData.canonicalName) {
        allDrinks.push({ id: allDrinks.length + 1, name: drinkData.name, canonicalName: drinkData.canonicalName, source: drinkData.source, drinkIngredients: [], ingredientTypes: [], ingredientSuperTypes: [] });
        last = allDrinks[allDrinks.length - 1];
    }
    const drinkIngredient = {
        name: drinkData.ingredient,
        ingredientId,
        amount: 1,
        unit: 'oz',
    };
    last.drinkIngredients.push(drinkIngredient);
    last.ingredientTypes.push(ingredientType);
    if (ingredientSuperType)
        last.ingredientSuperTypes.push(ingredientSuperType);
};
const writeOutput = function (outputFileName, outputData) {
    const outputFile = fs.createWriteStream(outputFileName);
    // Not ideal to hardcode our import here... but c'est la vie.
    outputFile.write(`import { DrinkState } from "../../types/ingredients";\n`);
    outputFile.write(`export const initialData: DrinkState = `);
    outputFile.write(JSON.stringify(outputData, null, 2));
    outputFile.end();
};
const parseIngredientLine = function (line, lineNumber) {
    const data = line.split('\t');
    return {
        name: data[0],
        ingredientType: data[1],
        ingredientSuperType: data[2],
        id: lineNumber
    };
};
const parseDrinkLine = function (line) {
    const data = line.split('\t');
    return {
        canonicalName: data[0],
        name: data[1],
        source: data[2],
        ingredient: data[3]
    };
};
const processIngredientData = function (ingredientData, processedData) {
    const ingredientTypes = processedData.ingredientTypes;
    if (!ingredientTypes[ingredientData.ingredientType]) {
        // If we haven't already seen this ingredient type, add it to the list and increase our index.
        // We use these types as autocomplete suggestions.
        ingredientTypes[ingredientData.ingredientType] = { id: processedData.ingredientTypeIndex };
        processedData.ingredientTypeIndex++;
    }
    // Update data to use processed index.
    ingredientData.ingredientType = ingredientTypes[ingredientData.ingredientType].id;
    if (ingredientData.ingredientSuperType) {
        if (!ingredientTypes[ingredientData.ingredientSuperType]) {
            ingredientTypes[ingredientData.ingredientSuperType] = { id: processedData.ingredientTypeIndex };
            processedData.ingredientTypeIndex++;
        }
        // Update data to use processed index
        ingredientData.ingredientSuperType = ingredientTypes[ingredientData.ingredientSuperType].id;
    }
    else {
        // We need to clear out the key so we don't return the empty string. This is dumb.
        delete ingredientData.ingredientSuperType;
    }
    // Cast to ingredient since we've overwritten string ids as numbers. But eww. Fix.
    processedData.ingredients.push(ingredientData);
    return processedData;
};
const normalizeIngredientTypes = function (processedData) {
    const ingredientTypes = processedData.ingredientTypes;
    const ingredientTypesArray = [];
    Object.keys(ingredientTypes).forEach((key) => {
        ingredientTypesArray.push({
            name: key,
            id: ingredientTypes[key].id
        });
    });
    delete processedData.ingredientTypeIndex;
    return { ...processedData, ingredientTypes: ingredientTypesArray };
};
processRawData();
