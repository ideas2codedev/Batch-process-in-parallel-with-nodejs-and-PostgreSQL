
showDiff();

function showDiff(){
var date1 = new Date("2013/01/18 06:59:00");   
var date2 = new Date();
//Customise date2 for your required future time

var diff = (date2 - date1)/1000;
var diff = Math.abs(Math.floor(diff));

var years = Math.floor(diff/(365*24*60*60));
var leftSec = diff - years * 365*24*60*60;

var month = Math.floor(leftSec/((365/12)*24*60*60));
var leftSec = leftSec - month * (365/12)*24*60*60;    

var days = Math.floor(leftSec/(24*60*60));
var leftSec = leftSec - days * 24*60*60;

var hrs = Math.floor(leftSec/(60*60));
var leftSec = leftSec - hrs * 60*60;

var min = Math.floor(leftSec/(60));
var leftSec = leftSec - min * 60;

console.log("You have " + years + " years "+ month + " month " + days + " days " + hrs + " hours " + min + " minutes and " + leftSec + " seconds the life time has passed.");
}