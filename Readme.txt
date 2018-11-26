INSTRUCTIONS:
  1. Copy the Source code zip file and extract it to the Desktop.
  2. Launch Command Prompt and execute below command,
	python -m SimpleHTTPServer
  3. "Serving HTTP on 0.0.0.0 port 8000 ... ", will be displayed. We need a server running to enable some features like   read data file operation.
  4. Copy paste following url in browser, http://localhost:8000/Desktop/GA-TSP_Assgn2/ga/index.html
  5. All set and ready for testing.


*******************************************

  SHOWCASE:
    Population: GENETIC DIVERSITY
      population 10, cross .3, mutation 0  Generations to acheieve best 11783 // bad,low diversity,takes alot of generations
   	  population 100, cross .3, mutation 0 Generations to acheieve best 1629 // good, high genetic diversity

    Crossover: 
      population 50, cross 0, mutation 0     // bad, local max problem
      population 50, cross 0.1, mutation 0   // bad, local max problem, sometimes luckily we get best for standard input
      population 50, cross .5, mutation 0 Generations to acheieve best 686 // pretty decent solver
      population 50, cross 1, mutation 0 Generations to acheieve best 121 // terrible solver

    Mutation:
      population 100, cross .3, mutation 0.01 Generations to acheieve best 117 // a terrible solver
      population 100, cross .3, mutation 1 Generations to acheieve best 397 // very nice solver 

*******************************************

Order of operations:
  Start with a population of potential solutions (routes)
  To create next gen:
    select two individuals- element of randomness, but the selection is biased toward fittest
    breed: (Roulette wheel selection implemented)
      1. Decide if they will exchange DNA(based on crossover rate obtained from frontend), if not pass one one of the parents clone to next step
      2. Apply mutation to each pass over Order based on mutation rate logic. Ex., if mutation rate = 1, then all the orders will go through mutation.
      3. Repeat 1-2 until we have new population of same size as old one

    In the case of my index.html, I will actually be displaying:
      Fittest individual (route) in our current generation
      Fittest individual ever produced by this run of the algorithm in this TSP instance.

*******************************************

  CROSSOVER
    low : increases convergence speed (fittest are likely to survive as-is to next gen)
          decreases exploratory power (easy to get stuck in local optimum)
          nobody having kids - next gen is clones; unlikely to get a fit cross

    high: decreases convergence speed (fittest unlikely to survive as-is)
          increases exploratory power (many crosses means a diverse population)
          the fittest have lower influence; sometimes we want them to just survive

  MUTATION
    Seems to slow us down on average 
    What makes it worth it, helps prevent the local maximum problem
 
    low : rely on fit-biased selection and crossover (increase convergence speed)
    high: slower (increasingly impossible) convergence, increase exploratory power
