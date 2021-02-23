export default class GenethicAlgorithm {
  constructor(phraseToGuess, populationSize, mutationRate, pow) {
    this.phraseToGuess = phraseToGuess
    this.populationSize = populationSize
    this.mutationRate = mutationRate
    this.pow = pow
    this.paused = false
    this.population = []
    this.populationSorted = []
    this.foundIndex = -1
    this.cycle = 0
    this.rateSum = 0
    this.powSum = 0
    this.bestWord = ''
    this.averageFitnessRate = 0
    this.bestFitnessRate = 0
  }

  newChar() {
    let c = Math.floor(Math.random() * 59) + 63
    if (c === 63) c = 32
    if (c === 64) c = 46

    return String.fromCharCode(c)
  }

  generatePopulation() {
    const wordLength = this.phraseToGuess.length
    for (let i = 0; i < this.populationSize; i++) {
      let randomPhrase = ''
      for (let o = 0; o < wordLength; o++) {
        randomPhrase += this.newChar()
      }
      const { fitnessRate, powFitnessRate } = this.fitnessLevel(randomPhrase)
      if (fitnessRate === 1) {
        this.foundIndex = i
      }
      this.population.push({
        randomPhrase,
        fitnessRate,
        powFitnessRate,
      })
    }
    this.populationSorted = this.population.sort(
      (a, b) => b.fitnessRate - a.fitnessRate
    )
  }

  fitnessLevel(randomPhrase) {
    let fitnessRate = 0
    for (let i = 0; i < this.phraseToGuess.length; i++) {
      if (this.phraseToGuess[i] === randomPhrase[i]) {
        fitnessRate++
      }
    }
    fitnessRate = fitnessRate / this.phraseToGuess.length
    return {
      fitnessRate,
      powFitnessRate: Math.pow(fitnessRate, this.pow),
    }
  }

  DNAchanges() {
    for (let i = 0; i < this.population.length; i++) {
      const a = this.improved()
      const b = this.improved()
      let child = this.crossover(a.randomPhrase, b.randomPhrase)
      child = this.mutate(child)
      this.population[i].randomPhrase = child
    }
  }

  calcFit() {
    this.rateSum = 0
    this.powSum = 0
    this.population.forEach((p, i) => {
      const { fitnessRate, powFitnessRate } = this.fitnessLevel(p.randomPhrase)
      this.population[i].fitnessRate = fitnessRate
      this.population[i].powFitnessRate = powFitnessRate
      if (p.fitnessRate > this.bestFitnessRate) {
        this.bestWord = p.randomPhrase
        this.bestFitnessRate = p.fitnessRate
      }
      if (fitnessRate === 1) {
        this.foundIndex = i
      }
      this.rateSum += p.fitnessRate
      this.powSum += p.powFitnessRate
    })
    this.populationSorted = this.population.sort(
      (a, b) => b.fitnessRate - a.fitnessRate
    )
    this.averageFitnessRate = this.rateSum / this.population.length
  }

  normalizeFitnessLevel() {
    this.population.forEach((p, i) => {
      this.population[i].powFitnessRate = p.powFitnessRate / this.powSum
    })
  }

  improved() {
    let index = 0
    let random = Math.random()
    while (random > 0) {
      random = random - this.population[index].powFitnessRate
      index++
    }
    index--
    return this.population[index]
  }

  mutate(child) {
    const chars = child.split('')
    for (let i = 0; i < chars.length; i++) {
      if (Math.random() <= this.mutationRate) {
        chars[i] = this.newChar()
      }
    }
    return chars.join('')
  }

  crossover(a, b) {
    const midpoint =
      Math.floor(Math.random() * (this.phraseToGuess.length - 2)) + 1
    let crossed = ''
    for (let i = 0; i < this.phraseToGuess.length; i++) {
      if (i <= midpoint) {
        crossed += a[i]
      } else {
        crossed += b[i]
      }
    }
    return crossed
  }

  startGuessing() {
    if (this.foundIndex < 0 && !this.paused) {
      this.cycle++
      this.calcFit()
      this.normalizeFitnessLevel()
      if (this.foundIndex < 0) {
        this.DNAchanges()
        setTimeout(() => {
          this.startGuessing()
        }, 1)
      }
    }
  }
}
