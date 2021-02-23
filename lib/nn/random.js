module.exports = class Random {
  static randomNormalized() {
    let r = 0
    const v = 4
    for (let i = v; i > 0; i--) {
      r += Math.random()
    }
    return r / v
  }
}
