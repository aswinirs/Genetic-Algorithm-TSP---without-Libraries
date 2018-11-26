
var population = [];
var cities = [];
var order = [];
var popSize;
var fitness = [];
var lat = []; var lon = [];
var recordDistance = Infinity;
var bestEver;
var currentBest;
var generation = 0;
var mutationRate = 0;
var crossOverRate = 0;
var started = false;
var v, filename;
var fileUploadMsg;
var minLon, minLat, maxLon, maxLat = 0;
var currentBestDistInThisGen = Infinity;
var currentBestDistInThisGenArr = [];
var currentAvgDistInThisGen = 0;
var currentAvgDistInThisGenArr = [];
var currentWorstDistInThisGen = 0;
var currentWorstDistInThisGenArr = [];
var bestEverDistSoFarArr = [];

function loadStandard() {
  var filename = document.getElementById("standard").value;
  loadStrings(filename, fileloaded);
  fileUploadMsg = "Standard File Uploaded !!";
}
function loadWestern() {
  clear();
  var filename = document.getElementById("western").value;
  loadStrings(filename, fileloaded);
  fileUploadMsg = "Western file uploaded";
}
function loadUruguay() {
  clear();
  var filename = document.getElementById("uruguay").value;
  loadStrings(filename, fileloaded);
  fileUploadMsg = "Uruguay file Uploaded";
}


function fileloaded(data) {
  for(var i=0;i<data.length;i++) {
    var line = data[i];
    var stringSplit = line.split(" ");
    lat[i] = stringSplit[1];lon[i] = stringSplit[2];
  }
  minLon=min(lon)-50;maxLon=max(lon)+50;minLat=min(lat)-50; maxLat=max(lat)+50;
  document.getElementById("fileUploaded").innerHTML = fileUploadMsg;
}

function start() {
  popSize = document.getElementById("popSizeIn").value;
  mutationRate = document.getElementById("pMutateIn").value;
  crossOverRate = document.getElementById("pCrossOverIn").value;
  setup();
  started = true;
}

function stop() {
  started = false;
}

function Pclear() {
 currentBestDistInThisGenArr = [];
 currentAvgDistInThisGen = 0;
 currentAvgDistInThisGenArr = [];
 currentWorstDistInThisGen = 0;
 currentWorstDistInThisGenArr = [];
 bestEverDistSoFarArr = [];
 setup();
}

function preload() {
  loadStandard();
}

//Intial setup, this method gets loaded along with global
//variables and preload when program is loaded in the browser

function setup() {

  canvas = createCanvas(window.innerWidth, 600);
  canvas.parent('canvascontainer');
  recordDistance = Infinity;
  generation = 0;
  order = [];
  for (var i = 0; i < lat.length; i++) {
    var v = createVector(lat[i],lon[i]);
    cities[i] = v;
    order[i] = i;
    }
  document.getElementById("totalCitys").innerHTML = order.length;
  for (var i = 0; i < popSize; i++) {
      population[i] = shuffle(order);
    }
}
//All front end drawings handled in this function
function draw() {

  if (started) {

      generation = generation+1;
      background(0);
      // GA
      calculateFitness();
      normalizeFitness();
      nextGeneration();

      stroke(255);
      strokeWeight(4);
      noFill();
      beginShape();

      for (var i = 0; i < currentBest.length; i++) {
        var n = currentBest[i];
        var mx = map(cities[n].x, minLat, maxLat, 0, window.innerWidth/4, true);
        //var my = map(cities[n].y, 42000, 43100, 0, height, true);
        var my = map(cities[n].y, minLon, maxLon, 0, height, true);
        vertex(mx, my);
        ellipse(mx, my, 16, 16);
      }
      // connecting the last and first city for return path
      var n = currentBest[0];
      var mx = map(cities[n].x, minLat, maxLat, 0, window.innerWidth/4, true);
      var my = map(cities[n].y, minLon, maxLon, 0, height, true);
      vertex(mx, my);
      ellipse(mx, my, 16, 16);

      endShape();

      //translate(0, height / 2);
      stroke(255);
      strokeWeight(4);
      noFill();
      beginShape();
      for (var i = 0; i < bestEver.length; i++) {
        var n = bestEver[i];
        //var mx = map(cities[n].x, 11000, 11500, 0, width/2, true);
        var mxBest = map(cities[n].x, minLat, maxLat, window.innerWidth/4, window.innerWidth/2, true);
        //var my = map(cities[n].y, 42000, 43100, 0, height, true);
        var myBest = map(cities[n].y, minLon, maxLon, 0, height, true);
        vertex(mxBest, myBest);
        ellipse(mxBest, myBest, 16, 16);
      }
      // connecting the last and first city for return path
      var n = bestEver[0];
      var mxBest = map(cities[n].x, minLat, maxLat, window.innerWidth/4, window.innerWidth/2, true);
      var myBest = map(cities[n].y, minLon, maxLon, 0, height, true);
      vertex(mxBest, myBest);
      ellipse(mxBest, myBest, 16, 16);

      endShape();

      //noFill();
      beginShape();
      if (generation != 0) {
        for (var i =0 ; i<currentBestDistInThisGenArr.length;i++) {
        var gen_X = map(i, 0, currentBestDistInThisGenArr.length, window.innerWidth/2, window.innerWidth);
        var currentBestGenArr_Y = map(currentBestDistInThisGenArr[i], min(bestEverDistSoFarArr)-500,
                    max(currentWorstDistInThisGenArr), 0, height);
        var currentAvgGenArr_Y = map(currentAvgDistInThisGenArr[i], min(bestEverDistSoFarArr)-500,
                    max(currentWorstDistInThisGenArr), 0, height);
        var currentWorstGenArr_Y = map(currentWorstDistInThisGenArr[i], min(bestEverDistSoFarArr)-500,
                    max(currentWorstDistInThisGenArr), 0, height);
        var bestEverGenArr_Y = map(bestEverDistSoFarArr[i], min(bestEverDistSoFarArr)-500,
                    max(currentWorstDistInThisGenArr), 0, height);

        vertex(gen_X, bestEverGenArr_Y);

        stroke('rgb(0,255,0)');
        point(gen_X, currentBestGenArr_Y);

        stroke(255, 204, 0);
        point(gen_X, currentAvgGenArr_Y);

        stroke('red');
        point(gen_X, currentWorstGenArr_Y);
        stroke('rgb(0,255,0)');

        }
      }
      endShape();

      // if (currentBestDistInThisGenArr.length>window.innerWidth/100) {
      //   currentBestDistInThisGenArr.splice(0,1);
      //   currentAvgDistInThisGenArr.splice(0,1);
      //   currentWorstDistInThisGenArr.splice(0,1);
      // }
    }
}

function swap(a, i, j) {
  var temp = a[i];
  a[i] = a[j];
  a[j] = temp;
}

// This function Calculates the Total Distance
function calcDistance(order) {
  var sum = 0;
    for (var i = 0; i < order.length - 1; i++) {
    var cityAIndex = order[i];
    var cityA = cities[cityAIndex];
    var cityBIndex = order[i + 1];
    var cityB = cities[cityBIndex];
    var d = dist(cityA.x, cityA.y, cityB.x, cityB.y);
    sum += d;
  }
  //calculating return path from last city to first city
    var cityAIndex = order[order.length-1];
    var cityA = cities[cityBIndex];
    var cityBIndex = order[0];
    var cityB = cities[cityAIndex];
    var d = dist(cityA.x, cityA.y, cityB.x, cityB.y);
    sum += d;

  return sum;
}