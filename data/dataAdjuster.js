const fs = require("fs"),
      data  = require("./donationDataSimpleJan-30-2019"),
      data2 = require("./donationDataSimpleJan-30-20192"),
      data3 = require("./donationDataSimpleJan-30-20193"),
      data4 = require("./donationDataSimpleJan-30-20194"),
      data5 = require("./donationDataSimpleJan-30-20195"),
      stateList = require('./stateList').stateList;
      // json files are loaded directly. But .js files, you need to target a const unless there's a default

// console.log(data[0]);

const allDataFiles = [data, data2, data3, data4, data5];

// map returns an array
// forEach doesn't
// each datafile is already an array

const cleanAllDataFiles = () => {
  const topLevelArray = [];
  allDataFiles.forEach((currentFile, index, array) => {
    currentFile.forEach((currentRecord, index, array) => {
      const randomStateIndex = Math.floor(Math.random() * 49);
      
      delete currentRecord.countryLivedIn; // wanted present tense
      const formattedRecord = Object.assign({}, currentRecord);
      formattedRecord.donationId = topLevelArray.length + 1;
      formattedRecord.donationDate = new Date(currentRecord.donationDate);
      formattedRecord.amountDonated = parseInt(currentRecord.amountDonated);
      formattedRecord.isRecurring = JSON.parse(currentRecord.isRecurring.toLowerCase());
      formattedRecord.stateLivingIn = stateList[randomStateIndex];
      formattedRecord.countryLivingIn = 'USA';
      
      topLevelArray.push(formattedRecord);
    });
  });
  return topLevelArray;
};

// I needed the array above the data files
// for that I needed a wrapper function that just returned the outer array
console.log(cleanAllDataFiles()[450]);

fs.writeFile('./data/cleanedSeedData.json', JSON.stringify(cleanAllDataFiles(), null, 2), error => {
  if (error) {
    console.log("=======ERROR=======");
    console.log(error);
  } else console.log("========New File Saved========");
  
});

