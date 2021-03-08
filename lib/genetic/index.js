export default class GeneticAlgorithm {
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
      this.population.push({
        randomPhrase,
      })
    }
  }

  fitnessLevel(randomPhrase) {
    let fitnessLevel = 0
    for (let i = 0; i < this.phraseToGuess.length; i++) {
      if (this.phraseToGuess[i] === randomPhrase[i]) {
        fitnessLevel++
      }
    }
    fitnessLevel = fitnessLevel / this.phraseToGuess.length
    const pow = Math.pow(fitnessLevel, this.pow)
    return { pow, fitnessLevel }
  }

  DNAchanges() {
    this.normalization()
    this.population.forEach((_, index) => {
      const a = this.selection()
      const b = this.selection()
      let child = this.crossover(a.randomPhrase, b.randomPhrase)
      child = this.mutate(child)
      this.population[index].randomPhrase = child
    })
  }

  calcFit() {
    this.rateSum = 0
    this.powSum = 0
    this.population.forEach((p, i) => {
      const { fitnessLevel, pow } = this.fitnessLevel(p.randomPhrase)
      this.population[i].powRate = pow
      this.population[i].fitnessLevel = fitnessLevel
      if (p.fitnessLevel > this.bestFitnessRate) {
        this.bestWord = p.randomPhrase
        this.bestFitnessRate = p.fitnessLevel
      }
      if (fitnessLevel === 1) {
        this.foundIndex = i
      }
      this.rateSum += p.fitnessLevel
      this.powSum += p.powRate
    })
    this.populationSorted = this.population.sort(
      (a, b) => b.fitnessLevel - a.fitnessLevel
    )
    this.averageFitnessRate = this.rateSum / this.population.length
  }

  normalization() {
    this.population.forEach((p, i) => {
      this.population[i].powRate = p.powRate / this.powSum
    })
  }

  selection() {
    let index = 0
    let random = Math.random()
    while (random > 0) {
      random = random - this.population[index].powRate
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

  startGuessing(timeout = false) {
    if (this.foundIndex < 0 && !this.paused) {
      this.cycle++
      this.calcFit()
      if (this.foundIndex < 0) {
        this.DNAchanges()
        if (timeout) {
          setTimeout(() => {
            this.startGuessing(timeout)
          }, 1)
        } else {
          this.startGuessing()
        }
      }
    }
  }
}
