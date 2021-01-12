class ReplayService {
  potService = require('./potService')
  pot = 0
  actions = []
  currentActionIndex = 0
  handHistory = ''
  handActions = ''
  seats = []
  usernames = []
  chips = []
  actionPattern = '.+: (folds|calls|checks|raises|bets)( \\d+( to \\d+)?)?'
  showdownActionPattern = '.+: (shows|mucks) (\\[.+\\]|hand)'
  darkBetPattern = '.+: posts (the )?(ante|(small blind)|(big blind)) \\d+'
  playing = false
  currentActionIndex = 0
  potElement
  potInfoElement
  tableElement

  initializeReplay (handHistory, usernames, chips) {
    this.handHistory = handHistory
    this.handActions = this.handHistory.split('\n')
    this.seats = document.getElementsByClassName('playerSeat')
    this.usernames = usernames
    this.chips = chips
    this.potInfoElement = document.getElementById('potInfo')
    this.potElement = document.getElementById('pot')
    this.tableElement = document.getElementById('table')
  }

  populateSteps (handHistory, usernames, chips) {
    this.initializeReplay(handHistory, usernames, chips)
    this.visualizeDarkBets()
    var toContinue = this.visualizePreflopAction()
    if (toContinue) {
      this.actions.push({ method: this.showFlop, params: null })
      toContinue = this.visualizeFlopAction()
      if (toContinue) {
        this.actions.push({ method: this.showTurn, params: null })
        toContinue = this.visualizeTurnAction()
        if (toContinue) {
          this.actions.push({ method: this.showRiver, params: null })
          toContinue = this.visualizeRiverAction()
          if (toContinue) {
            this.visualizeShowDown()
          }
        }
      }
    }
  }

  async playAll () {
    this.playing = true
    for (var i = this.currentActionIndex; i < this.actions.length; i++) {
      if (this.playing) {
        var currentAction = this.actions[i]
        currentAction.method.call(this, currentAction.params)
        await this.delay(500)
      } else {
        return
      }
      this.currentActionIndex = i + 1
    }
  }

  pause () {
    this.playing = false
  }

  playCurrent () {
    if (this.currentActionIndex >= this.actions.length) {
      return
    }
    var functionToCall = this.actions[this.currentActionIndex]
    functionToCall.method.call(this, functionToCall.params)
    this.currentActionIndex++
  }

  visualizeDarkBets () {
    var matches = this.handHistory.matchAll(this.darkBetPattern)
    for (const match of matches) {
      match[0] = match[0].replace('the ', '').replace('blind ', '')
      var actionDetails = match[0].split(' ')
      var username = actionDetails[0].replace(':', '')
      var action = actionDetails[2]
      var amount = actionDetails[3]
      switch (action) {
        case 'big': this.actions.push({ method: this.bigBlind, params: [username, amount] }); break
        case 'small': this.actions.push({ method: this.smallBlind, params: [username, amount] }); break
        case 'ante': this.actions.push({ method: this.ante, params: [username, amount] }); break
      }
    }
  }

  visualizePreflopAction () {
    var toContinue = true
    var flopData = this.handHistory.match('\\*\\*\\* FLOP \\*\\*\\*.+')
    var preflopEndIndex
    if (!flopData) {
      toContinue = false
      preflopEndIndex = this.handActions.indexOf('*** SUMMARY ***')
    } else {
      preflopEndIndex = this.handActions.indexOf(flopData[0])
    }
    var preflopIndex = this.handActions.indexOf('*** HOLE CARDS ***') + 2
    for (var i = preflopIndex; i < preflopEndIndex; i++) {
      var currentAction = this.handActions[i]
      if (currentAction.match(this.actionPattern)) {
        var actionDetails = currentAction.split(' ')
        actionDetails[0] = actionDetails[0].replace(':', '') // username
        switch (actionDetails[1]) {
          case 'folds': this.actions.push({ method: this.fold, params: actionDetails[0] }); break
          case 'calls': this.actions.push({ method: this.call, params: [actionDetails[0], actionDetails[2]] }); break
          case 'checks': this.actions.push({ method: this.check, params: actionDetails[0] }); break
          case 'raises': this.actions.push({ method: this.raise, params: [actionDetails[0], actionDetails[2], actionDetails[4]] })
        }
      }
    }

    return toContinue
  }

  visualizeFlopAction () {
    var toContinue = true
    var turnData = this.handHistory.match('\\*\\*\\* TURN \\*\\*\\*.+')
    var flopEndIndex
    if (!turnData) {
      toContinue = false
      flopEndIndex = this.handActions.indexOf('*** SUMMARY ***')
    } else {
      flopEndIndex = this.handActions.indexOf(turnData[0])
    }
    var flopIndex = this.handActions.indexOf(this.handHistory.match('\\*\\*\\* FLOP \\*\\*\\*.+')[0]) + 1
    this.clearBets()
    for (var i = flopIndex; i < flopEndIndex; i++) {
      var currentAction = this.handActions[i]
      if (currentAction.match(this.actionPattern)) {
        var actionDetails = currentAction.split(' ')
        actionDetails[0] = actionDetails[0].replace(':', '')
        switch (actionDetails[1]) {
          case 'folds': this.actions.push({ method: this.fold, params: actionDetails[0] }); break
          case 'calls': this.actions.push({ method: this.call, params: [actionDetails[0], actionDetails[2]] }); break
          case 'checks': this.actions.push({ method: this.check, params: actionDetails[0] }); break
          case 'raises': this.actions.push({ method: this.raise, params: [actionDetails[0], actionDetails[2], actionDetails[4]] }); break
          case 'bets': this.actions.push({ method: this.bet, params: [actionDetails[0], actionDetails[2]] })
        }
      }
    }

    return toContinue
  }

  visualizeTurnAction () {
    var toContinue = true
    var riverData = this.handHistory.match('\\*\\*\\* RIVER \\*\\*\\*.+')
    var turnEndIndex
    if (!riverData) {
      toContinue = false
      turnEndIndex = this.handActions.indexOf('*** SUMMARY ***')
    } else {
      turnEndIndex = this.handActions.indexOf(riverData[0])
    }
    var turnIndex = this.handActions.indexOf(this.handHistory.match('\\*\\*\\* TURN \\*\\*\\*.+')[0]) + 1

    for (var i = turnIndex; i < turnEndIndex; i++) {
      var currentAction = this.handActions[i]
      console.log(currentAction)
      if (currentAction.match(this.actionPattern)) {
        var actionDetails = currentAction.split(' ')
        actionDetails[0] = actionDetails[0].replace(':', '')
        switch (actionDetails[1]) {
          case 'folds': this.actions.push({ method: this.fold, params: actionDetails[0] }); break
          case 'calls': this.actions.push({ method: this.call, params: [actionDetails[0], actionDetails[2]] }); break
          case 'checks': this.actions.push({ method: this.check, params: actionDetails[0] }); break
          case 'raises': this.actions.push({ method: this.raise, params: [actionDetails[0], actionDetails[2], actionDetails[4]] }); break
          case 'bets': this.actions.push({ method: this.bet, params: [actionDetails[0], actionDetails[2]] }); break
        }
      }
    }

    return toContinue
  }

  visualizeRiverAction () {
    var toContinue = true
    var showDownIndex = this.handActions.indexOf('*** SHOW DOWN ***')
    var riverEndIndex
    if (showDownIndex === -1) {
      toContinue = false
      riverEndIndex = this.handActions.indexOf('*** SUMMARY ***')
    } else {
      riverEndIndex = showDownIndex
    }
    var riverIndex = this.handActions.indexOf(this.handHistory.match('\\*\\*\\* RIVER \\*\\*\\*.+')[0]) + 1

    for (var i = riverIndex; i < riverEndIndex; i++) {
      var currentAction = this.handActions[i]
      if (currentAction.match(this.actionPattern)) {
        var actionDetails = currentAction.split(' ')
        actionDetails[0] = actionDetails[0].replace(':', '')
        switch (actionDetails[1]) {
          case 'folds': this.actions.push({ method: this.fold, params: actionDetails[0] }); break
          case 'calls': this.actions.push({ method: this.call, params: [actionDetails[0], actionDetails[2]] }); break
          case 'checks': this.actions.push({ method: this.check, params: actionDetails[0] }); break
          case 'raises': this.actions.push({ method: this.raise, params: [actionDetails[0], actionDetails[2], actionDetails[4]] }); break
          case 'bets': this.actions.push({ method: this.bet, params: [actionDetails[0], actionDetails[2]] }); break
        }
      }
    }

    return toContinue
  }

  visualizeShowDown () {
    var showDownIndex = this.handActions.indexOf('*** SHOW DOWN ***') + 1
    var showDownEndIndex = this.handActions.indexOf('*** SUMMARY ***')

    for (var i = showDownIndex; i < showDownEndIndex; i++) {
      var currentAction = this.handActions[i]
      if (currentAction.match(this.showdownActionPattern)) {
        var actionDetails = currentAction.split(' ')
        var username = actionDetails[0].replace(':', '')
        var action = actionDetails[1]
        switch (action) {
          case 'mucks': this.actions.push({ method: this.muck, params: username }); break
          case 'shows': this.actions.push({ method: this.show, params: [username, actionDetails[2], actionDetails[3]] }); break
        }
      }
    }
  }

  visualizeBet (amount, element) {
    var chipPile = this.potService.getChipsFor(amount)
    var diffY = 0
    for (var i = 0; i < chipPile.length; i++) {
      var chipImage = document.createElementNS('http://www.w3.org/2000/svg', 'image')
      chipImage.setAttribute('class', 'chipInfo ' + element.id)
      chipImage.setAttribute('href', require('@/assets/chips/' + chipPile[i] + '.svg'))
      switch (element.id) {
        case 'seat1':
          chipImage.setAttribute('x', element.getBoundingClientRect().x)
          chipImage.setAttribute('y', element.getBoundingClientRect().y * 0.67 - diffY)
          break
        case 'seat2':
          chipImage.setAttribute('x', element.getBoundingClientRect().x * 2.25)
          chipImage.setAttribute('y', element.getBoundingClientRect().y * 0.8 - diffY)
          break
        case 'seat3':
          chipImage.setAttribute('x', element.getBoundingClientRect().x * 0.87)
          chipImage.setAttribute('y', element.getBoundingClientRect().y * 0.8 - diffY)
          break
        case 'seat4':
          chipImage.setAttribute('x', element.getBoundingClientRect().x)
          chipImage.setAttribute('y', element.getBoundingClientRect().y * 0.9 - diffY)
          break
        case 'seat5':
          chipImage.setAttribute('x', element.getBoundingClientRect().x)
          chipImage.setAttribute('y', element.getBoundingClientRect().y * 0.9 - diffY)
          break
        case 'seat6':
          chipImage.setAttribute('x', element.getBoundingClientRect().x * 1.5)
          chipImage.setAttribute('y', element.getBoundingClientRect().y - diffY)
          break
        case 'seat7':
          chipImage.setAttribute('x', element.getBoundingClientRect().x * 0.9)
          chipImage.setAttribute('y', element.getBoundingClientRect().y - diffY)
          break
        case 'seat8':
          chipImage.setAttribute('x', element.getBoundingClientRect().x * 0.85)
          chipImage.setAttribute('y', element.getBoundingClientRect().y - element.getBoundingClientRect().height * 1.5 - diffY)
          break
        case 'seat9':
          chipImage.setAttribute('x', element.getBoundingClientRect().x * 1.75)
          chipImage.setAttribute('y', element.getBoundingClientRect().y - element.getBoundingClientRect().height * 1.1 - diffY)
          break
      }
      this.tableElement.appendChild(chipImage)
      diffY += 6
    }
  }

  updatePot (amount) {
    this.pot += amount
    this.potInfoElement.textContent = 'Pot: ' + this.pot
  }

  ante (data) {
    var username = data[0]
    var amount = parseInt(data[1])
    var seatToPostAnte = this.getSeat(username)
    this.updatePot(amount)
    this.updateChips(amount, seatToPostAnte)
    this.displayComment('ANTE', username, seatToPostAnte)
  }

  smallBlind (data) {
    var username = data[0]
    var amount = parseInt(data[1])
    var seatToPostSmallBlind = this.getSeat(username)
    this.updatePot(amount)
    this.updateChips(amount, seatToPostSmallBlind)
    this.visualizeBet(amount, seatToPostSmallBlind)
    this.displayComment('SMALL BLIND', username, seatToPostSmallBlind)
  }

  bigBlind (data) {
    var username = data[0]
    var amount = parseInt(data[1])
    var seatToPostBigBlind = this.getSeat(username)
    this.updatePot(amount)
    this.updateChips(amount, seatToPostBigBlind)
    this.visualizeBet(amount, seatToPostBigBlind)
    this.displayComment('BIG BLIND', username, seatToPostBigBlind)
  }

  fold (username) {
    var seatToFold = this.getSeat(username)
    seatToFold.setAttribute('style', '')
    for (const image of seatToFold.getElementsByTagName('image')) {
      image.setAttribute('visibility', 'hidden')
    }
    this.displayComment('FOLD', username, seatToFold)
  }

  bet (data) {
    var username = data[0]
    var amount = parseInt(data[1])
    var seatToBet = this.getSeat(username)
    this.updatePot(amount)
    this.updateChips(amount, seatToBet)
    this.visualizeBet(amount, seatToBet)
    this.displayComment('BET', username, seatToBet)
  }

  call (data) {
    var username = data[0]
    var amount = parseInt(data[1])
    var seatToCall = this.getSeat(username)
    this.updatePot(amount)
    this.updateChips(amount, seatToCall)
    this.visualizeBet(amount, seatToCall)
    this.displayComment('CALL', username, seatToCall)
  }

  check (username) {
    var seatToCheck = this.getSeat(username)
    this.displayComment('CHECK', username, seatToCheck)
  }

  raise (data) {
    var username = data[0]
    var raised = parseInt(data[1])
    var totalAmount = parseInt(data[2])
    var seatToRaise = this.getSeat(username)
    this.updatePot(raised)
    this.updateChips(raised, seatToRaise)
    this.visualizeBet(totalAmount, seatToRaise)
    this.displayComment('RAISE', username, seatToRaise)
  }

  muck (username) {
    var seatToMuck = this.getSeat(username)
    seatToMuck.setAttribute('style', '')
    for (const image of seatToMuck.getElementsByTagName('image')) {
      image.setAttribute('visibility', 'hidden')
    }
    this.displayComment('MUCK', username, seatToMuck)
  }

  show (data) {
    var username = data[0]
    var seatToShow = this.getSeat(username)
    var cardsElements = seatToShow.getElementsByTagName('image')

    for (var i = 0; i < cardsElements.length; i++) {
      var currentCard = data[i + 1]
      currentCard = currentCard.replace('[', '')
      currentCard = currentCard.replace(']', '')
      var card = currentCard.toUpperCase()
      var suit = currentCard[1]
      switch (suit) {
        case 's': suit = 'spades'; break
        case 'h': suit = 'hearts'; break
        case 'd': suit = 'diamonds'; break
        case 'c': suit = 'clubs'; break
      }
      cardsElements[i].setAttribute('href', require('@/assets/cards/' + suit + '/' + card + '.svg'))
    }

    this.displayComment('SHOW', username, seatToShow)
  }

  showFlop () {
    this.potService.collectBets()
    var card1 = document.getElementById('flop1')
    var card2 = document.getElementById('flop2')
    var card3 = document.getElementById('flop3')
    card1.setAttribute('visibility', 'visible')
    card2.setAttribute('visibility', 'visible')
    card3.setAttribute('visibility', 'visible')
    var matches = this.handHistory.match('FLOP.+')[0].matchAll('(([2-9]|[AKQJT])[scdh])')
    var i = 0
    for (const match of matches) {
      var card = match[0].toUpperCase()
      var suit = match[0][1]
      switch (suit) {
        case 's': suit = 'spades'; break
        case 'h': suit = 'hearts'; break
        case 'd': suit = 'diamonds'; break
        case 'c': suit = 'clubs'; break
      }
      switch (i) {
        case 0: card1.setAttribute('href', require('@/assets/cards/' + suit + '/' + card + '.svg')); break
        case 1: card2.setAttribute('href', require('@/assets/cards/' + suit + '/' + card + '.svg')); break
        case 2: card3.setAttribute('href', require('@/assets/cards/' + suit + '/' + card + '.svg')); break
      }
      i++
    }
  }

  showTurn () {
    this.potService.collectBets()
    var turnCardElement = document.getElementById('turn')
    turnCardElement.setAttribute('visibility', 'visible')
    var matches = this.handHistory.match('TURN.+')[0].match('\\[([2-9]|[AKQJT])[schd]\\]')[0]
    var card = matches[1] + matches[2].toUpperCase()
    var suit
    switch (card[1]) {
      case 'S': suit = 'spades'; break
      case 'D': suit = 'diamonds'; break
      case 'H': suit = 'hearts'; break
      case 'C': suit = 'clubs'; break
    }
    turnCardElement.setAttribute('href', require('@/assets/cards/' + suit + '/' + card + '.svg'))
  }

  showRiver () {
    this.potService.collectBets()
    var riverCardElement = document.getElementById('river')
    riverCardElement.setAttribute('visibility', 'visible')
    var matches = this.handHistory.match('RIVER.+')[0].match('\\[([2-9]|[AKQJT])[schd]\\]')[0]
    var card = matches[1] + matches[2].toUpperCase()
    var suit
    switch (card[1]) {
      case 'S': suit = 'spades'; break
      case 'D': suit = 'diamonds'; break
      case 'H': suit = 'hearts'; break
      case 'C': suit = 'clubs'; break
    }
    riverCardElement.setAttribute('href', require('@/assets/cards/' + suit + '/' + card + '.svg'))
  }

  gatherPlayersData (handHistory, playerUsername, seats) {
    var matches = handHistory.matchAll('Seat \\d: [^ ]+ \\(\\$?\\d+\\.?\\d*')
    var emptySeats = [1, 8, 6, 3, 5, 4, 7] // indexes where name must be empty depending on empty seats count
    var beforePlayer = []
    var afterPlayer = []
    var beforePlayerChips = []
    var afterPlayerChips = []
    var foundPlayer = false
    for (const match of matches) {
      var current = match[0].substring(8, match[0].indexOf('(') - 1)
      var currentChips = match[0].substring(match[0].indexOf('(') + 1)
      if (current === playerUsername) {
        foundPlayer = true
        afterPlayer.push(current)
        afterPlayerChips.push(currentChips)
        continue
      }
      if (foundPlayer) {
        afterPlayer.push(current)
        afterPlayerChips.push(currentChips)
      } else {
        beforePlayer.push(current)
        beforePlayerChips.push(currentChips)
      }
    }
    var result = [[], []]
    var resultUsernames = afterPlayer.concat(beforePlayer)
    var resultChips = afterPlayerChips.concat(beforePlayerChips)
    for (var i = 0; i < 9 - seats; i++) {
      resultUsernames.splice(emptySeats[i], 0, '')
      resultChips.splice(emptySeats[i], 0, '')
    }
    result[0].push(resultUsernames)
    result[1].push(resultChips)
    return result
  }

  displayComment (comment, username, element) {
    var actionText = element.getElementsByTagName('text')[0]
    var nextButton = document.getElementById('nextButton')
    nextButton.setAttribute('disabled', 'disabled')
    actionText.textContent = comment
    setTimeout(function () {
      actionText.textContent = username
      nextButton.removeAttribute('disabled')
    }, 500)
  }

  updateChips (amount, element) {
    var chipsElement = element.getElementById('playerChips')
    var chips = parseInt(chipsElement.textContent)
    chips -= amount
    chipsElement.textContent = chips
  }

  getSeat (username) {
    var seatToAct
    for (const seat of this.seats) {
      if (seat.textContent.includes(username)) {
        seatToAct = seat
        break
      }
    }

    return seatToAct
  }

  delay (time) {
    return new Promise((resolve) => {
      setTimeout(() => resolve(), time)
    })
  }

  clearBets () {
    for (const element of document.getElementsByClassName('betInfo')) {
      element.remove()
    }
  }
}

export default new ReplayService()
