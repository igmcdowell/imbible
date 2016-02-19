"use strict";

const fs = require('fs')

const readInput = function({ fileName, outputFileName, processLineFn, addLineFn, finalProcessFn }) {
  let lineNumber = 0
  const lineReader = require('readline').createInterface({
    input: fs.createReadStream(fileName)
  });
  let processedData
  lineReader.on('line', function (line) {
    lineNumber++
    const lineData = processLineFn(line, lineNumber)
    processedData = addLineFn(lineData, processedData)
  })

  lineReader.on('close', () => {
    processedData = finalProcessFn(processedData)
    writeOutput(outputFileName, processedData)
  })
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
    id: lineNumber
  }
}

const processIngredientData = function(ingredientData, processedData = {ingredients: [], ingredientTypes: {}, ingredientTypeIndex: 1}) {
  const ingredientTypes = processedData.ingredientTypes
  if(!ingredientTypes[ingredientData.type]) {
    ingredientTypes[ingredientData.type] = {id: processedData.ingredientTypeIndex, ingredients: []}
    processedData.ingredientTypeIndex++
  } 
  const ingredientTypeData = ingredientTypes[ingredientData.type]
  ingredientTypeData.ingredients.push(ingredientData.id)
  ingredientTypes[ingredientData.type] = ingredientTypeData

  processedData.ingredients.push({id: ingredientData.id, name: ingredientData.name, ingredientType: ingredientTypeData.id})
  return processedData
}

const normalizeIngredientTypes = function(processedData) {
  const ingredientTypes = processedData.ingredientTypes
  const ingredientTypesArray = []
  Object.keys(ingredientTypes).forEach((key) => {
    ingredientTypesArray.push({name: key, ingredients: ingredientTypes[key].ingredients, id: ingredientTypes[key].id})
  })
  processedData.ingredientTypes = ingredientTypesArray
  delete processedData.ingredientTypeIndex
  return processedData
}

readInput({
  fileName: './ingredients.tsv', 
  outputFileName: './ingredients.json', 
  processLineFn: parseIngredientLine, 
  addLineFn: processIngredientData,
  finalProcessFn: normalizeIngredientTypes,
})
