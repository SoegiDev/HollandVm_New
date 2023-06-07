function formatDate() {
  var Dt = new Date();
  var DateFormat = getYear(Dt) + getMonth(Dt);
  var format = DateFormat + Math.random().toString(36).substr(2, 9);
  return format;
}

function getMonth(d) {
  //get the month
  var month = d.getMonth();

  //increment month by 1 since it is 0 indexed
  //converts month to a string
  //if month is 1-9 pad right with a 0 for two digits
  month = (month + 1).toString().padStart(2, "0");

  return month;
}

// function getDay with 1 parameter expecting date
// This function returns a string of type dd (example: 09 = The 9th day of the month)
function getDay(d) {
  //get the day
  //convert day to string
  //if day is between 1-9 pad right with a 0 for two digits
  var day = d.getDate().toString().padStart(2, "0");

  return day;
}

// function getYear with 1 parameter expecting date
// This function returns the year in format yy (example: 21 = 2021)
function getYear(d) {
  //get the year
  var year = d.getFullYear();

  //pull the last two digits of the year
  year = year.toString().substr(-2);

  return year;
}

export { formatDate };
