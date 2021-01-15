var availableChips = [0.01, 0.05, 0.25, 1, 5, 25, 100, 500, 1000, 5000, 25000, 100000, 500000]
var groupBoundaries = [100000, 1000, 100, 1, 0.01]
var groupDiffY = [0, 0, 0, 0, 0]
var pot = 0

exports.getChipsFor = function (amount) {
  var chipPile = []
  var sum = 0
  for (var i = availableChips.length - 1; i >= 0; i--) {
    var currentChipNominal = availableChips[i]
    if (sum + currentChipNominal > amount) {
      continue
    } else {
      sum += currentChipNominal
      chipPile.push(currentChipNominal)
      i++
    }
  }
  return chipPile
}

exports.collectBets = function () {
  exports.clearChips(document)

  while (document.getElementsByClassName('chipDetails').length > 0) {
    document.getElementsByClassName('chipDetails')[0].remove()
  }

  var potElement = document.getElementById('pot')
  var chipPile = exports.getChipsFor(pot)
  for (const chipNominal of chipPile) {
    var potChip = document.createElementNS('http://www.w3.org/2000/svg', 'image')
    potChip.setAttribute('href', require('@/assets/chips/' + chipNominal + '.svg'))
    potChip.setAttribute('class', 'chipInfo')
    for (var i = 0; i < groupBoundaries.length; i++) {
      if (chipNominal >= groupBoundaries[i]) {
        potChip.setAttribute('y', potChip.getBoundingClientRect().y - groupDiffY[i])
        potElement.getElementById(groupBoundaries[i]).appendChild(potChip)
        break
      }
    }
    groupDiffY[i] += 5
  }
  groupDiffY = groupDiffY.map(x => 0)
}

exports.clearChips = function (element) {
  while (element.getElementsByClassName('chipInfo').length > 0) {
    element.getElementsByClassName('chipInfo')[0].remove()
  }
}

exports.distributeWinnersChips = function (winners) {
  var winnersChips = []
  for (const winner of winners) {
    var winnerDetails = winner[0].split(' ')
    var winnerUsername = winnerDetails[0]
    var amount = parseFloat(winner[0].split(' ')[2].replace('$', ''))
    var isFound = false
    for (var i = 0; i < winnersChips.length; i++) {
      if (winnersChips[i].username === winnerUsername) {
        winnersChips[i].amount += amount
        isFound = true
        break
      }
    }
    if (!isFound) {
      winnersChips.push({ username: winnerUsername, amount: amount })
    }
  }

  return winnersChips
}

exports.updatePot = function (amount, potInfoElement) {
  pot += amount
  if (amount % 1 !== 0) {
    potInfoElement.textContent = 'Pot: $' + pot.toFixed(2)
  } else {
    potInfoElement.textContent = 'Pot: ' + pot
  }
}

exports.getPot = function () {
  return pot
}

exports.reset = function () {
  pot = 0
}
