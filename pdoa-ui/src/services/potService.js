var availableChips = [0.01, 0.05, 0.25, 1, 5, 25, 100, 500, 1000, 5000, 25000, 100000, 500000]
var groupBoundaries = [100000, 1000, 100, 1, 0.01]
var groupDiffY = [0, 0, 0, 0, 0]

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
  while (document.getElementsByClassName('chipInfo').length > 0) {
    document.getElementsByClassName('chipInfo')[0].remove()
  }
  var potElement = document.getElementById('pot')
  var chipPile = exports.getChipsFor(parseInt(document.getElementById('potInfo').textContent.split(' ')[1]))
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
