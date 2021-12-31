module.exports = {
  reduceExpensesArray: (array) => {
    const data = []
    for (let i = 0; i < array.length; i++) {
      data.push(Number(array[i].amount))
    }
    return Number((data.reduce(function(a, b) { return a + b; }, 0)).toFixed(2))
  }
} 