
//Fitness Function to evaluate every generation
function calculateFitness() {
  currentBestDistInThisGen = Infinity;
  currentAvgDistInThisGen = 0;
  currentWorstDistInThisGen = 0;
    document.getElementById("genNumber").innerHTML = generation;
  for (var i = 0; i < population.length; i++) {
    //console.log(population[i]);
    var d = calcDistance(population[i]);
    if (d < recordDistance) {
      recordDistance = d;
      bestEver = population[i];
      var bestEverGen = generation;
      document.getElementById("bestOrder").innerHTML = bestEver;
      document.getElementById("fittestGens").innerHTML = bestEverGen;
      document.getElementById("shortestEver").innerHTML = recordDistance;
    }
    if (d < currentBestDistInThisGen) {
      currentBestDistInThisGen = d;
      currentBest = population[i];
      document.getElementById("shortestNow").innerHTML = currentBestDistInThisGen;
    }
    currentAvgDistInThisGen = currentAvgDistInThisGen + d;
    if (i == population.length - 1) {
      currentAvgDistInThisGen = currentAvgDistInThisGen/(i+1);
      document.getElementById("averageNow").innerHTML = currentAvgDistInThisGen;
    }

    if (currentWorstDistInThisGen < d) {
      currentWorstDistInThisGen = d;
      currentWorst = population[i];
      document.getElementById("longestNow").innerHTML = currentWorstDistInThisGen;
    }
      fitness[i] = 1 / d;
  }
  bestEverDistSoFarArr.push(recordDistance);
  currentBestDistInThisGenArr.push(currentBestDistInThisGen);
  currentAvgDistInThisGenArr.push(currentAvgDistInThisGen);
  currentWorstDistInThisGenArr.push(currentWorstDistInThisGen);
}

//Normalising Fitness, so these values can be mapped to roulette wheel selection of best fit parents
function normalizeFitness() {
  var sum = 0;
  for (var i = 0; i < fitness.length; i++) {
    sum += fitness[i];
  }
  for (var i = 0; i < fitness.length; i++) {
    fitness[i] = fitness[i] / sum;;
  }
}

function nextGeneration() {
  var newPopulation = [];
  for (var i = 0; i < population.length; i++) {

    //Choosing parents based on thier fitness (roulette wheel selection)
    var orderA = pickOne(population, fitness);
    var orderB = pickOne(population, fitness);

    //CrossOver the parents
    var newOrderRet = crossOver(crossOverRate, orderA, orderB);

    //Perform mutation based on the mutation rate
    mutate(newOrderRet, mutationRate);
    newPopulation[i] = newOrderRet;

    }
    population = newPopulation;
}

//Roulette wheel slection of parents - best fit parents have more chnaces to get selected.
function pickOne(list, prob) {
  var index = 0;
  var r = random(1);

  while (r > 0) {
    r = r - prob[index];
    index++;
  }
  index--;
  return list[index].slice();
}

function crossOver(crossOverRate, orderA, orderB) {
  //Multiple crossOver adapted here.
  var neworder;
  if (random(1) <= crossOverRate) {
  var start = floor(random(orderA.length));
  var end = floor(random(start + 1, orderA.length));
  neworder = orderA.slice(start, end);
  // var left = totalCities - neworder.length;
    for (var i = 0; i < orderB.length; i++) {
      var city = orderB[i];
      if (!neworder.includes(city)) {
        neworder.push(city);
      }
    }
  } else {
  //If crossover did not happen then clone one of the parents and pass on,
  // both parents have equal chance to be cloned.
      if (random(1) <= 0.5)
        neworder = orderA;
      else
        neworder = orderB;
    }
  return neworder;
}

// Higher the mutationRate, chnaces of mutation is higher.
// fr ex., mutationRate = 1, all the orders will go through mutation
function mutate(order, mutationRate) {
  if (random(1) <= mutationRate) {
    for (var i = 0; i < order.length; i++) {
      var indexA = floor(random(order.length));
      var indexB = (indexA + 1) % order.length;
      swap(order, indexA, indexB);
    }
  }
}