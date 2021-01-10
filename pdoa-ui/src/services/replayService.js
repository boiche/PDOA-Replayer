class ReplayService {
  pot = 0
  actions = []
  currentActionIndex = 0

  populateSteps (handHistory) {
    this.actions.push(this.postSmallBlind)
    this.actions.push(this.postBigBlind)
  }

  updatePot (amount) {
    this.pot += amount
    document.getElementById('potInfo').textContent = 'Pot: ' + this.pot
  }

  postSmallBlind () {
    console.log('posted small blind')
    this.updatePot(15)
  }

  postBigBlind () {
    console.log('posted big blind')
    this.updatePot(30)
  }

  play (index) {
    if (index < 0 || index >= this.actions.length) return false
    this.actions[index].call(this)
    return true
  }

  next () {
    this.actions[this.currentActionIndex]()
    this.currentActionIndex++
  }

  gatherOppsNames (handHistory, playerUsername, seats) {
    var matches = handHistory.matchAll('Seat \\d: [^ ]+ \\((\\$|\\d)')
    var emptySeats = [1, 8, 6, 3, 5, 4, 7] // indexes where name must be empty depending on empty seats count
    var beforePlayer = []
    var afterPlayer = []
    var foundPlayer = false
    for (const match of matches) {
      var current = match[0].substring(8, match[0].length - 3)
      if (current === playerUsername) {
        foundPlayer = true
        afterPlayer.push(current)
        continue
      }
      if (foundPlayer) {
        afterPlayer.push(current)
      } else {
        beforePlayer.push(current)
      }
    }
    var result = afterPlayer.concat(beforePlayer)
    for (var i = 0; i < 9 - seats; i++) {
      result.splice(emptySeats[i], 0, '')
    }
    return result
  }
}

export default new ReplayService()
