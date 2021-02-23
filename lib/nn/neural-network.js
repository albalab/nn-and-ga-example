const Matrix = require('./matrix')

module.exports = class NeuralNetwork {
  constructor(
    inputNodes,
    hiddenNodes,
    outputNodes,
    learningRate,
    bias,
    trainingCycles,
    normalizer
  ) {
    this.inputNodes = inputNodes
    this.hiddenNodes = hiddenNodes
    this.outputNodes = outputNodes
    this.learningRate = learningRate
    this.weightsInputToHidden = Matrix.generate(
      this.hiddenNodes,
      this.inputNodes,
      { randomNormalized: true }
    )
    this.weightsHiddenToOutput = Matrix.generate(
      this.outputNodes,
      this.hiddenNodes,
      { randomNormalized: true }
    )
    this.bias = bias
    this.biasForHidden = Matrix.generate(this.hiddenNodes, 1, {
      staticNumber: this.bias,
    })
    this.biasForOutput = Matrix.generate(this.outputNodes, 1, {
      staticNumber: this.bias,
    })
    this.trainingCycles = trainingCycles
    this.normalizer = normalizer
  }

  ReLU(x) {
    return x > 0 ? x : 0.0
  }

  derivativeReLU(y) {
    return y <= 0 ? 0 : 1
  }

  train(trainData) {
    for (let c = 0; c < this.trainingCycles; c++) {
      const randomPicked = Math.floor(Math.random() * trainData.length)
      const { output, hidden, input } = this.feedforward(
        trainData[randomPicked].input
      )
      const answer = Matrix.fromArray(trainData[randomPicked].answer)
      const outputError = Matrix.map(answer, { m: output, subtract: true })
      const outputGradients = this.calculateGradient(output, outputError)
      this.adjustWeights(
        hidden,
        this.weightsHiddenToOutput,
        this.biasForOutput,
        outputGradients
      )
      const weightsHiddenToOutputT = Matrix.transpose(
        this.weightsHiddenToOutput
      )
      const hiddenError = Matrix.multiply(weightsHiddenToOutputT, outputError)
      const hiddenGradient = this.calculateGradient(hidden, hiddenError)
      this.adjustWeights(
        input,
        this.weightsInputToHidden,
        this.biasForHidden,
        hiddenGradient
      )
    }
  }

  adjustWeights(input, weights, bias, gradients) {
    const inputT = Matrix.transpose(input)
    const weightsDelta = Matrix.multiply(gradients, inputT)
    weights = Matrix.map(weights, { m: weightsDelta, add: true })
    bias = Matrix.map(bias, { m: gradients, add: true })
  }

  calculateGradient(input, error) {
    let gradients = Matrix.map(input, { func: this.derivativeReLU })
    gradients = Matrix.map(gradients, { m: error, multiply: true })
    gradients = Matrix.map(gradients, {
      number: this.learningRate,
      multiply: true,
    })
    return gradients
  }

  calculateFF(input, weights, bias) {
    let output = Matrix.multiply(weights, input)
    output = Matrix.map(output, { m: bias, add: true })
    output = Matrix.map(output, { func: this.ReLU })
    return output
  }

  normalize(inputArray) {
    return inputArray.map((input) => {
      return input / this.normalizer
    })
  }

  feedforward(inputArray) {
    inputArray = this.normalize(inputArray)
    const input = Matrix.fromArray(inputArray)
    const hidden = this.calculateFF(
      input,
      this.weightsInputToHidden,
      this.biasForHidden
    )
    const output = this.calculateFF(
      hidden,
      this.weightsHiddenToOutput,
      this.biasForOutput
    )
    return { output, hidden, input }
  }
}
