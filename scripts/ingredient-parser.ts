import {IIngredient, IDrinkIngredient, IIngredientType, IDrink} from '../types/ingredients';
import * as fs from 'fs';
import * as readline from 'readline';
import * as process from 'process';

// Set path for input/output files
process.chdir('scripts');

const drinksInput = 'drinks_with_ingredients.tsv';
const ingredientsInput = 'ingredients.tsv';
const output = '../src/react/drinkData.ts';

interface ProcessedData {
  ingredients: IIngredient[];
  ingredientTypes: {[name: string]: {id: number}};
  ingredientTypeIndex: number;
  drinks: IDrink[];
}

interface ReturnedData {
  ingredients: IIngredient[];
  ingredientTypes: IIngredientType[];
  drinks: IDrink[];
}

const processRawData = function () {
  let lineNumber = 0;
  const lineReader = readline.createInterface({
    input: fs.createReadStream(ingredientsInput),
  });
  let processedData: ProcessedData = {ingredients: [], ingredientTypes: {}, ingredientTypeIndex: 1, drinks: []};
  lineReader.on('line', function (line) {
    lineNumber++;
    const lineData = parseIngredientLine(line, lineNumber);
    processedData = processIngredientData(lineData, processedData);
  });

  lineReader.on('close', () => {
    readDrinkInput({processedData: normalizeIngredientTypes(processedData)});
  });
};

interface ProcessingDrink extends IDrink {
  canonicalName?: string;
}

const readDrinkInput = function ({processedData}: {processedData: ReturnedData}) {
  const ingredientsByName: {[ingredient: string]: IIngredient} = {};
  processedData.ingredients.forEach(i => (ingredientsByName[i.name] = i));
  let allDrinks: ProcessingDrink[] = [];
  const lineReader = readline.createInterface({
    input: fs.createReadStream(drinksInput),
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

const processDrinkDataLine = function (
  drinkData: RawDrinkLine,
  allDrinks: ProcessingDrink[],
  ingredientsByName: {[key: string]: IIngredient}
) {
  let last = allDrinks[allDrinks.length - 1];
  if (!ingredientsByName[drinkData.ingredient]) {
    return;
  }
  const {ingredientType, ingredientSuperType, id: ingredientId} = ingredientsByName[drinkData.ingredient];

  if (!last || last.canonicalName !== drinkData.canonicalName) {
    allDrinks.push({
      id: allDrinks.length + 1,
      name: drinkData.name,
      canonicalName: drinkData.canonicalName,
      source: drinkData.source,
      drinkIngredients: [],
      ingredientTypes: [],
      ingredientSuperTypes: [],
    });
    last = allDrinks[allDrinks.length - 1];
  }

  const drinkIngredient: IDrinkIngredient = {
    name: drinkData.ingredient,
    ingredientId,
    amount: drinkData.amount,
    unit: drinkData.unit,
  };
  last.drinkIngredients.push(drinkIngredient);
  last.ingredientTypes.push(ingredientType);
  if (ingredientSuperType) last.ingredientSuperTypes.push(ingredientSuperType);
};

const writeOutput = function (outputFileName: string, outputData: any) {
  const outputFile = fs.createWriteStream(outputFileName);
  // Not ideal to hardcode our import here... but c'est la vie.
  outputFile.write(`import { DrinkState } from "../../types/ingredients";\n`);
  outputFile.write(`export const initialData: DrinkState = `);
  outputFile.write(JSON.stringify(outputData, null, 2));
  outputFile.end();
};

type IngredientLine = {
  name: string;
  // TODO: this is super dirty, it starts as a string then mutates to a number
  ingredientType: string | number;
  ingredientSuperType: string | number;
  id: number;
};

const parseIngredientLine = function (line: string, lineNumber: number): IngredientLine {
  const data = line.split('\t');
  return {
    name: data[0],
    ingredientType: data[1],
    ingredientSuperType: data[2],
    id: lineNumber,
  };
};

interface RawDrinkLine {
  canonicalName: string;
  name: string;
  source: string;
  ingredient: string;
  amount: number;
  unit: string;
}

const parseDrinkLine = function (line: string): RawDrinkLine {
  const data = line.split('\t');
  return {
    canonicalName: data[0],
    name: data[1],
    source: data[2],
    ingredient: data[3],
    amount: parseFloat(data[4]),
    unit: data[5],
  };
};

const processIngredientData = function (ingredientData: IngredientLine, processedData: ProcessedData): ProcessedData {
  const ingredientTypes = processedData.ingredientTypes;
  if (!ingredientTypes[ingredientData.ingredientType]) {
    // If we haven't already seen this ingredient type, add it to the list and increase our index.
    // We use these types as autocomplete suggestions.
    ingredientTypes[ingredientData.ingredientType] = {id: processedData.ingredientTypeIndex};
    processedData.ingredientTypeIndex++;
  }
  // Update data to use processed index.
  ingredientData.ingredientType = ingredientTypes[ingredientData.ingredientType].id;

  if (ingredientData.ingredientSuperType) {
    if (!ingredientTypes[ingredientData.ingredientSuperType]) {
      ingredientTypes[ingredientData.ingredientSuperType] = {id: processedData.ingredientTypeIndex};
      processedData.ingredientTypeIndex++;
    }
    // Update data to use processed index
    ingredientData.ingredientSuperType = ingredientTypes[ingredientData.ingredientSuperType].id;
  } else {
    // We need to clear out the key so we don't return the empty string. This is dumb.
    delete ingredientData.ingredientSuperType;
  }

  // Cast to ingredient since we've overwritten string ids as numbers. But eww. Fix.
  processedData.ingredients.push(ingredientData as IIngredient);
  return processedData;
};

const normalizeIngredientTypes = function (processedData: ProcessedData): ReturnedData {
  const ingredientTypes = processedData.ingredientTypes;
  const ingredientTypesArray: IIngredientType[] = [];
  Object.keys(ingredientTypes).forEach(key => {
    ingredientTypesArray.push({
      name: key,
      id: ingredientTypes[key].id,
    });
  });

  delete processedData.ingredientTypeIndex;
  return {...processedData, ingredientTypes: ingredientTypesArray};
};

processRawData();
