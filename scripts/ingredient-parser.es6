"use strict";

const fs = require('fs')
const readline = require('readline')
const drinksInput = 'drinks.tsv'
const ingredientsInput = 'ingredients.tsv'
const output = 'imbibleData.json'

const processRawData = function() {
  let lineNumber = 0
  const lineReader = readline.createInterface({
    input: fs.createReadStream(ingredientsInput)
  });
  let processedData
  lineReader.on('line', function (line) {
    lineNumber++
    const lineData = parseIngredientLine(line, lineNumber)
    processedData = processIngredientData(lineData, processedData)
  })

  lineReader.on('close', () => {
    processedData = normalizeIngredientTypes(processedData)
    readDrinkInput({processedData: processedData})
  })
}

const readDrinkInput = function({processedData}) {
    const ingredientsByName = {}
    processedData.ingredients.forEach( i => ingredientsByName[i.name] = i)
    let allDrinks = []
    let allDrinkIngredients = []
    const lineReader = readline.createInterface({
      input: fs.createReadStream(drinksInput)
    })

    lineReader.on('line', function (line) {
      const lineData = parseDrinkLine(line)
      processDrinkDataLine(lineData, allDrinks, allDrinkIngredients, ingredientsByName)
    })

    lineReader.on('close', () => {
      allDrinks.forEach(d => delete d.canonicalName)
      allDrinks.sort( (d1, d2) => d1.name.localeCompare(d2.name))
      processedData.drinks = allDrinks
      processedData.drinkIngredients = allDrinkIngredients
      writeOutput(output, processedData)
    })
}

const processDrinkDataLine = function(drinkData, allDrinks, allDrinkIngredients, ingredientsByName) {
  let last = allDrinks[allDrinks.length - 1]
  if(!ingredientsByName[drinkData.ingredient]) {
    console.log('could not find', drinkData.ingredient)
    return
  }
  const {ingredientType, ingredientSuperType, id: ingredientId} = ingredientsByName[drinkData.ingredient]

  if (!last || last.canonicalName !== drinkData.canonicalName) {
    allDrinks.push({id: allDrinks.length + 1, name: drinkData.name, canonicalName: drinkData.canonicalName, source: drinkData.source, drinkIngredients:[], ingredientTypes:[], ingredientSuperTypes:[]})
    last = allDrinks[allDrinks.length - 1]
  }
  
  const drinkIngredient = {
    ingredientId, 
    id: allDrinkIngredients.length + 1,
    // drinkId: last.id,
    amount: 1,
    unit: 'oz',
  }
  allDrinkIngredients.push(drinkIngredient)
  last.drinkIngredients.push(drinkIngredient.id)
  last.ingredientTypes.push(ingredientType)
  if (ingredientSuperType) last.ingredientSuperTypes.push(ingredientSuperType)
}


const writeOutput = function(outputFileName, outputData){
  const outputFile = fs.createWriteStream(outputFileName)
  outputFile.write(JSON.stringify(outputData, null, 2))
  outputFile.end()
}

const parseIngredientLine = function(line, lineNumber) {
  const data = line.split('\t')
  return {
    name: data[0],
    type: data[1],
    superType: data[2],
    id: lineNumber
  }
}

const parseDrinkLine = function(line) {
  const data = line.split('\t')
  return {
    canonicalName: data[0],
    name: data[1],
    source: data[2],
    ingredient: data[3]
  }  
}


const processIngredientData = function(ingredientData, processedData = {ingredients: [], ingredientTypes: {}, ingredientTypeIndex: 1}) {
  const ingredientTypes = processedData.ingredientTypes
  if(!ingredientTypes[ingredientData.type]) {
    ingredientTypes[ingredientData.type] = {id: processedData.ingredientTypeIndex } //, ingredients: []
    processedData.ingredientTypeIndex++
  }

  const ingredient = {
    id: ingredientData.id, 
    name: ingredientData.name, 
    ingredientType: ingredientTypes[ingredientData.type].id
  }

  if(ingredientData.superType) {
    if (!ingredientTypes[ingredientData.superType]) {
      ingredientTypes[ingredientData.superType] = {id: processedData.ingredientTypeIndex } //, ingredients: []
      processedData.ingredientTypeIndex++
    }

    ingredient.ingredientSuperType = ingredientTypes[ingredientData.superType].id
  } 

  processedData.ingredients.push(ingredient)
  return processedData
}

const normalizeIngredientTypes = function(processedData) {
  const ingredientTypes = processedData.ingredientTypes
  const ingredientTypesArray = []
  Object.keys(ingredientTypes).forEach((key) => {
    ingredientTypesArray.push({
      name: key, 
      id: ingredientTypes[key].id
    })
  })
  processedData.ingredientTypes = ingredientTypesArray
  delete processedData.ingredientTypeIndex
  return processedData
}

processRawData()
