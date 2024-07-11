const scoresheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("scores")
const bans = SpreadsheetApp
  .getActiveSpreadsheet()
  .getSheetByName("interdits")
  .getRange("A:A")
  .getValues()
  .map(el => el[0])
const parametersheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("parametrage")

function getMinMaxScores(){
  return parametersheet.getRange("B1:B2")
    .getValues()
    .map(el=> parseInt(el))
}

function badRequest(message){
  return ContentService.createTextOutput("400 \n" + message)
}

function isScoreNotPlausible(score){
  const [minScore, maxScore] = getMinMaxScores()
  return score <= minScore || score >= maxScore
}

function isAlphabetic(input) {
  // Regular expression to match only alphabetic characters (both uppercase and lowercase)
  var regex = /^[a-z]+$/;
  
  // Test the input string against the regular expression
  return regex.test(input.toLowerCase());
}

function doGet(e) {
  var scores = scoresheet.getRange("A:B").getValues()
  return ContentService.createTextOutput(JSON.stringify(scores))
}

function doPost(e){
  const name = e.parameter.name
  let score = e.parameter.score
  let answer = "answer : \nparameters :" + " name = " + name + ", score = " + score + "\n"
  let isRequestValid = true;
  
  const parametersAreInvalid = name.length < 2 || score.length < 1 

  score = parseInt(score)
  const scoreIsNotPlausible = isScoreNotPlausible(score)

  if(parametersAreInvalid){
    isRequestValid = false
    answer += "invalid parameters : name length must be longer than 3 and score length must be longer than 2" + "\n"
  }

  if(scoreIsNotPlausible){
    isRequestValid = false
    const [minScore, maxScore] = getMinMaxScores()
    answer += `invalid score int value : score int value must be higher than ${minScore} and lower than ${maxScore}` + "\n"
  }

  const nameIsNotAlphabetic = !isAlphabetic(name)
  if(nameIsNotAlphabetic){
    isRequestValid = false
    answer += `invalid name : must only contain letters` + "\n"
  }

  if(bans.includes(name.toLowerCase())){
    isRequestValid = false
    answer += `invalid name : forbidden word` + "\n"
  }
  
  let requestIsInvalid = !isRequestValid
  if(requestIsInvalid){
    return badRequest(answer)
  }
  
  scoresheet.insertRowBefore(1)
  scoresheet.getRange("A1").setValue(name)
  scoresheet.getRange("B1").setValue(score)

  return ContentService.createTextOutput("200 \n"+answer)
}


let e = {parameter: {name : "n4z1", score : "12000"}}
let result = doPost(e)
console.log(result.getContent())
