/**
 * Sends a message to Slack channel when there is a new party to plan. 
 * Takes data from a google sheet with a tab for the list of parties, which populates another tab, called "reminders", 
 * when reminder date = today(). Each row in "reminders" represents one new party to plan.
 * One Slack message per row.
*/

// Checks whether this is a test run
function isTest() { // Must return false for message to reach the right Slack channel
  return false;
}

// Notify the Slack channel
function setUpPartybotMessage() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("reminders"); //Only working in the "Reminders" tab
  
  // Define data range and message variables
  var startRow = 2; // First row of data to process
  var lastRow = sheet.getLastRow();
  var dataRange = sheet.getRange(startRow, 1, lastRow-1, 4); // There's one header row
  
  // Fetch values for each row in the Range.
  var data = dataRange.getValues();
  
  // Loop through the rows and send one message per row
  for (var i = 0; i < data.length; i++) {
    if (data[i][1] !== "") {
     sendNewMessage(data[i]) ;
     }
  }
}

function getChannel() {
 if(isTest()) {
 return "@samantha"; // Replace with test user
 } else {
 return "#party-committee"; // Replace with Slack channel for when the bot is ready
 }
}
  
function sendNewMessage(row) {
  var slack_webhook = "https://hooks.slack.com/services/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"; // Replace with incoming webhook
  var channel = getChannel(); // Verify whether this is a test
  var sheetURL = SpreadsheetApp.getActiveSpreadsheet().getUrl(); // Gets the spreadsheet link

  var payload = {
    "channel": channel ,
    "username": "PartyBot",
    "icon_emoji": ":sunglasses:",
    "text": ">>>*TIME TO PLAN A NEW PARTY HEYOOO*"+
    "\n:star-struck: *This party is for:* "+ row[0] + 
    "\n:clinking_glasses: *Date of celebration:* "+ row[1] +
    "\n*Reason to celebrate:* " + row[2] +
    "\n*What they like:* " + row[3] +
    "\n(check the Spreadsheet for more details: " + sheetURL + ")"
  };
 
  var options = {
    "method": "post",
    "contentType": "application/json",
    "payload": JSON.stringify(payload)
  };
  
  Logger.log(UrlFetchApp.fetch(slack_webhook, options));
}