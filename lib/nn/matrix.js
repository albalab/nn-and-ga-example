const Random = require('./random')

module.exports = class Matrix {
  static generate(rows, columns, options = {}) {
    const matrix = []
    for (let r = 0; r < rows; r++) {
      matrix.push([])
      for (let c = 0; c < columns; c++) {
        if (options.randomNormalized) {
          matrix[r].push(Random.randomNormalized() - 0.5)
        } else if (options.staticNumber) {
          matrix[r].push(options.staticNumber)
        } else {
          matrix[r].push(0)
        }
      }
    }
    return matrix
  }

  static fromArray(array) {
    const matrix = []
    for (let r = 0; r < array.length; r++) {
      matrix.push([])
      matrix[r].push(array[r])
    }
    return matrix
  }

  static map(matrix, { m, func, number, add, subtract, multiply }) {
    matrix.forEach((r, ri) => {
      r.forEach((_, ci) => {
        if (number || m) {
          const value = number || m[ri][ci]
          if (add) {
            matrix[ri][ci] += value
          } else if (subtract) {
            matrix[ri][ci] -= value
          } else if (multiply) {
            matrix[ri][ci] *= value
          } else {
            throw new Error(
              'Add, subtract, multiply options should be provided'
            )
          }
        } else if (func) {
          matrix[ri][ci] = func(matrix[ri][ci])
        } else {
          throw new Error('Addition not provided or has wrong type')
        }
      })
    })
    return matrix
  }

  static transpose(matrix) {
    const resultMatrix = Matrix.generate(matrix[0].length, matrix.length)
    matrix.forEach((row, colIndex) => {
      row.forEach((r, rowIndex) => {
        resultMatrix[rowIndex][colIndex] = r
      })
    })
    return resultMatrix
  }

  static multiply(a, b) {
    const colsA = a[0].length
    const rowsA = a.length
    const colsB = b[0].length
    const rowsB = b.length
    if (colsA !== rowsB) {
      throw new Error(
        'Columns of A must match rows of B in matrix multiply function'
      )
    }
    const resultMatrix = []
    for (let r = 0; r < rowsA; r++) {
      resultMatrix.push([])
      for (let c = 0; c < colsB; c++) {
        let sum = 0
        a[r].forEach((ar, arIndex) => {
          sum += ar * b[arIndex][c]
        })
        resultMatrix[r].push(sum)
      }
    }
    return resultMatrix
  }
}
