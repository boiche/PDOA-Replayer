class ReplayService {
  potService = require('./potService')
  actions = []
  currentActionIndex = 0
  handHistory = ''
  handActions = ''
  seats = []
  usernames = []
  chips = []
  actionPattern = '.+: (folds|calls|checks|raises|bets)( \\$?\\d+(\\.\\d{2})( to \\$?\\d+(\\.\\d{2}))?)?'
  showdownActionPattern = '.+: (shows|mucks) (\\[.+\\]|hand)'
  blindsPattern = '.+: posts ((small blind)|(big blind)) \\$?\\d+(\\.\\d{2})?'
  antesPattern = '.+: posts the ante \\$?\\d+(\\.\\d{2})?'
  svgNS = 'http://www.w3.org/2000/svg'
  playing = false
  currentActionIndex = 0
  potElement
  potInfoElement
  tableElement
  initialData
  tableComponent

  // section for replay controlls
  async playAll (caller) {
    this.playing = true
    for (var i = this.currentActionIndex; i < this.actions.length; i++) {
      if (this.playing) {
        var currentAction = this.actions[i]
        currentAction.method.call(this, currentAction.params)
        await this.delay(750)
      } else {
        return
      }
      this.currentActionIndex = i + 1
    }

    caller.finished = true
  }

  playCurrent (caller) {
    if (this.currentActionIndex >= this.actions.length) {
      caller.finished = true
      return
    }
    var functionToCall = this.actions[this.currentActionIndex]
    functionToCall.method.call(this, functionToCall.params)
    this.currentActionIndex++
  }

  pause () {
    this.playing = false
  }

  // section for replay action methods
  // collective methods
  visualizeBlinds () {
    var matches = this.handHistory.matchAll(this.blindsPattern)
    for (const match of matches) {
      var actionDetails = match[0].split(' ')
      var username = actionDetails[0].replace(':', '')
      var action = actionDetails[2]
      var amount = actionDetails[4]
      switch (action) {
        case 'big': this.actions.push({ method: this.bigBlind, params: [username, amount] }); break
        case 'small': this.actions.push({ method: this.smallBlind, params: [username, amount] }); break
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
    var preflopIndex = this.handActions.indexOf('*** HOLE CARDS ***') + 1
    if (this.handActions[preflopIndex].startsWith('Dealt')) {
      preflopIndex++
    }
    for (var i = preflopIndex; i < preflopEndIndex; i++) {
      var currentAction = this.handActions[i]
      if (currentAction.match(this.actionPattern)) {
        var actionDetails = currentAction.split(' ')
        var username = actionDetails[0].replace(':', '') // username
        switch (actionDetails[1]) {
          case 'folds': this.actions.push({ method: this.fold, params: username }); break
          case 'calls': this.actions.push({ method: this.call, params: [username, actionDetails[2]] }); break
          case 'checks': this.actions.push({ method: this.check, params: username }); break
          case 'raises': this.actions.push({ method: this.raise, params: [username, actionDetails[2], actionDetails[4]] })
        }
      } else {
        actionDetails = currentAction.split(' ')
        if (actionDetails[0] === 'Uncalled') {
          username = actionDetails[5]
          var amount = parseFloat(actionDetails[2].replace('(', '').replace(')', '').replace('$', ''))
          this.actions.push({ method: this.uncalledBet, params: [username, amount] })
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
      } else {
        actionDetails = currentAction.split(' ')
        if (actionDetails[0] === 'Uncalled') {
          var username = actionDetails[5]
          var amount = parseFloat(actionDetails[2].replace('(', '').replace(')', '').replace('$', ''))
          this.actions.push({ method: this.uncalledBet, params: [username, amount] })
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
      } else {
        actionDetails = currentAction.split(' ')
        if (actionDetails[0] === 'Uncalled') {
          var username = actionDetails[5]
          var amount = parseFloat(actionDetails[2].replace('(', '').replace(')', '').replace('$', ''))
          this.actions.push({ method: this.uncalledBet, params: [username, amount] })
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
      } else {
        actionDetails = currentAction.split(' ')
        if (actionDetails[0] === 'Uncalled') {
          var username = actionDetails[5]
          var amount = parseFloat(actionDetails[2].replace('(', '').replace(')', '').replace('$', ''))
          this.actions.push({ method: this.uncalledBet, params: [username, amount] })
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

  // action methods
  postAntes () {
    var matches = this.handHistory.matchAll(this.antesPattern)
    var totalAnteAmount = 0
    for (const match of matches) {
      var anteDetails = match[0].split(' ')
      var username = anteDetails[0].replace(':', '')
      var anteAmount = parseFloat(anteDetails[4].replace('$', ''))
      var seatToPostAnte = this.getSeat(username)
      totalAnteAmount += anteAmount
      this.updateChips(anteAmount, seatToPostAnte)
      this.displayComment('ANTE', username, seatToPostAnte)
    }
    this.potService.updatePot(totalAnteAmount, this.potInfoElement)
    this.potService.collectBets()
  }

  smallBlind (data) {
    var username = data[0]
    var amount = parseFloat(data[1].replace('$', ''))
    var seatToPostSmallBlind = this.getSeat(username)
    this.potService.updatePot(amount, this.potInfoElement)
    this.updateChips(amount, seatToPostSmallBlind)
    this.visualizeChipsOnTable(amount, seatToPostSmallBlind, 'smallBlind')
    this.displayComment('SMALL BLIND', username, seatToPostSmallBlind)
  }

  bigBlind (data) {
    var username = data[0]
    var amount = parseFloat(data[1].replace('$', ''))
    var seatToPostBigBlind = this.getSeat(username)
    this.potService.updatePot(amount, this.potInfoElement)
    this.updateChips(amount, seatToPostBigBlind)
    this.visualizeChipsOnTable(amount, seatToPostBigBlind, 'bigBlind')
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
    var amount = parseFloat(data[1].replace('$', ''))
    var seatToBet = this.getSeat(username)
    this.potService.updatePot(amount, this.potInfoElement)
    this.updateChips(amount, seatToBet)
    this.visualizeChipsOnTable(amount, seatToBet, 'bet')
    this.displayComment('BET', username, seatToBet)
  }

  call (data) {
    var username = data[0]
    var amount = parseFloat(data[1].replace('$', ''))
    var seatToCall = this.getSeat(username)
    this.potService.updatePot(amount, this.potInfoElement)
    this.updateChips(amount, seatToCall)
    this.visualizeChipsOnTable(amount, seatToCall, 'call')
    this.displayComment('CALL', username, seatToCall)
  }

  check (username) {
    var seatToCheck = this.getSeat(username)
    this.displayComment('CHECK', username, seatToCheck)
  }

  raise (data) {
    var username = data[0]
    var totalAmount = parseFloat(data[2].replace('$', ''))
    var seatToRaise = this.getSeat(username)
    this.visualizeChipsOnTable(totalAmount, seatToRaise, 'raise')
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

  uncalledBet (data) {
    var username = data[0]
    var amount = data[1]
    var seatToReturn = this.getSeat(username)
    this.visualizeChipsOnTable(amount, seatToReturn, 'uncalledBet')
  }

  // street methods
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

  showWinners () {
    var winners = this.handHistory.matchAll('.+ collected \\$?\\d+(\\.\\d{2})?')
    var winnersChips = this.potService.distributeWinnersChips(winners)
    var totalWinnings = 0
    for (const winner of winnersChips) {
      var seatToWin = this.getSeat(winner.username)
      this.visualizeChipsOnTable(winner.amount, seatToWin, 'win')
      totalWinnings += winner.amount
      this.displayComment('WIN', winner.username, seatToWin)
    }

    // remove chips of the pot
    for (const potGroup of document.getElementById('pot').querySelectorAll('g')) {
      while (potGroup.firstChild) {
        potGroup.firstChild.remove()
      }
    }
    this.potService.updatePot(-totalWinnings, this.potInfoElement)
  }

  // section for initializing replay
  populateSteps (hand, caller) {
    this.initializeReplay(hand, caller)
    if (this.handHistory.match(this.antesPattern)) {
      this.actions.push({ method: this.postAntes, params: null })
    }
    this.visualizeBlinds()
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
            this.actions.push({ method: this.potService.collectBets, params: null })
            this.visualizeShowDown()
          }
        }
      }
    }
    this.actions.push({ method: this.showWinners, params: null })
  }

  initializeReplay (hand, caller) {
    this.tableComponent = caller
    this.initialData = hand
    this.handHistory = hand.handHistory.handHistory
    this.handActions = this.handHistory.split('\n')
    this.seats = document.getElementsByClassName('playerSeat')
    var playersData = this.gatherPlayersData(this.handHistory, hand.username, hand.seats)
    this.usernames = playersData[0][0]
    this.chips = playersData[1][0]
    this.potInfoElement = document.getElementById('potInfo')
    this.potElement = document.getElementById('pot')
    this.tableElement = document.getElementById('table')
    this.potService.reset()
    this.setButtonCoords()
    this.dealPlayerCards(caller)
    this.hideUnseated()
  }

  gatherPlayersData (handHistory, playerUsername, seats) {
    var matches = handHistory.matchAll('Seat \\d: .+(?<!collected) \\(\\$?\\d+(\\.?\\d{2})?')
    var emptySeats = [1, 8, 6, 3, 5, 4, 7] // indexes where name must be empty depending on empty seats count
    var beforePlayer = []
    var afterPlayer = []
    var beforePlayerChips = []
    var afterPlayerChips = []
    var foundPlayer = false
    var iterations = 0
    for (const match of matches) {
      iterations++
      if (iterations > this.initialData.seats) {
        break
      }
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
    resultUsernames.splice(resultUsernames.length - 1, resultUsernames)
    for (const index of emptySeats.slice(0, 9 - seats).sort()) {
      resultUsernames.splice(index, 0, '')
      resultChips.splice(index, 0, '')
    }
    result[0].push(resultUsernames)
    result[1].push(resultChips)
    return result
  }

  setButtonCoords () {
    var seatOrder = [1, 9, 2, 6, 4, 5, 7, 3, 8]
    var button = document.getElementById('button')
    var seatId = this.handHistory.match('#\\d is the button')[0][1]
    var dealerUsername = this.handHistory.match('Seat ' + seatId + ': .+ \\((\\$|\\d)')[0]
    dealerUsername = dealerUsername.substring(dealerUsername.indexOf(':') + 2, dealerUsername.indexOf('(') - 1)
    var dealerSeatId = seatOrder[this.usernames.indexOf(dealerUsername)]
    var seat = document.getElementById('seat' + dealerSeatId)
    switch (dealerSeatId) {
      case 1:
        button.setAttribute('x', seat.getBoundingClientRect().x)
        button.setAttribute('y', seat.getBoundingClientRect().y * 0.67)
        break
      case 2:
        button.setAttribute('x', seat.getBoundingClientRect().x * 2.25)
        button.setAttribute('y', seat.getBoundingClientRect().y * 0.8)
        break
      case 3:
        button.setAttribute('x', seat.getBoundingClientRect().x * 0.87)
        button.setAttribute('y', seat.getBoundingClientRect().y * 0.8)
        break
      case 4:
        button.setAttribute('x', seat.getBoundingClientRect().x)
        button.setAttribute('y', seat.getBoundingClientRect().y * 0.9)
        break
      case 5:
        button.setAttribute('x', seat.getBoundingClientRect().x)
        button.setAttribute('y', seat.getBoundingClientRect().y * 0.9)
        break
      case 6:
        button.setAttribute('x', seat.getBoundingClientRect().x * 1.5)
        button.setAttribute('y', seat.getBoundingClientRect().y)
        break
      case 7:
        button.setAttribute('x', seat.getBoundingClientRect().x * 0.9)
        button.setAttribute('y', seat.getBoundingClientRect().y)
        break
      case 8:
        button.setAttribute('x', seat.getBoundingClientRect().x * 0.85)
        button.setAttribute('y', seat.getBoundingClientRect().y - seat.getBoundingClientRect().height * 1.5)
        break
      case 9:
        button.setAttribute('x', seat.getBoundingClientRect().x * 1.75)
        button.setAttribute('y', seat.getBoundingClientRect().y - seat.getBoundingClientRect().height * 1.1)
        break
    }
  }

  hideUnseated () {
    if (this.initialData.seats < 9) {
      for (var i = this.initialData.seats + 1; i <= 9; i++) {
        var seat = document.getElementById('seat' + i)
        for (const image of seat.querySelectorAll('image')) {
          image.setAttribute('visibility', 'hidden')
        }
        seat.setAttribute('visibility', 'hidden')
      }
    }
  }

  dealPlayerCards (caller) {
    var playersHoleCards = this.handHistory.match('Dealt to .+')
    if (playersHoleCards) {
      var playersHoleCardsDetails = playersHoleCards[0].split(' ')
      this.playerInitialSeat = this.handHistory.match('Seat \\d: ' + playersHoleCardsDetails[2])[0].substr(5, 1)

      var firstCard = playersHoleCardsDetails[3].replace('[', '')
      firstCard = firstCard.toUpperCase()
      var suit = firstCard[1]
      switch (suit.toUpperCase()) {
        case 'S': caller.playersFirstSuit = 'spades'; break
        case 'C': caller.playersFirstSuit = 'clubs'; break
        case 'H': caller.playersFirstSuit = 'hearts'; break
        case 'D': caller.playersFirstSuit = 'diamonds'; break
      }
      caller.playersFirstCard = firstCard

      var secondCard = playersHoleCardsDetails[4].replace(']', '')
      secondCard = secondCard.toUpperCase()
      suit = secondCard[1]
      switch (suit.toUpperCase()) {
        case 'S': caller.playersSecondSuit = 'spades'; break
        case 'C': caller.playersSecondSuit = 'clubs'; break
        case 'H': caller.playersSecondSuit = 'hearts'; break
        case 'D': caller.playersSecondSuit = 'diamonds'; break
      }
      caller.playersSecondCard = secondCard
    }
  }

  // section for reseting replay
  reset () {
    this.currentActionIndex = 0
    this.hideHoleCards()
    this.resetStacks()
    this.clearBoard()
    this.removePlayersBetGroups()
    this.initializeReplay(this.initialData, this.tableComponent)
  }

  hideHoleCards () {
    for (const card of document.querySelectorAll('image.holeCard')) {
      card.setAttribute('href', require('@/assets/cards/backs/2B.svg'))
      card.setAttribute('visibility', 'visible')
    }
  }

  resetStacks () {
    for (var i = 0; i < this.usernames.length; i++) {
      var currentUsername = this.usernames[i]
      if (currentUsername === '') {
        continue
      }
      var seat = this.getSeat(currentUsername)
      seat.querySelector('text.playerChips').textContent = this.chips[i]
    }
  }

  clearBoard () {
    for (const card of document.querySelectorAll('image.communityCard')) {
      card.setAttribute('visibility', 'hidden')
    }
  }

  removePlayersBetGroups () {
    for (const group of document.querySelectorAll('g.chipDetails')) {
      group.remove()
    }
  }

  // utils
  visualizeChipsOnTable (amount, element, action) {
    var group = document.getElementById(element.id + 'chips')
    if (!group) {
      group = document.createElementNS(this.svgNS, 'g')
      group.setAttribute('id', element.id + 'chips')
      group.setAttribute('class', 'chipDetails')
      this.tableElement.appendChild(group)
      if (action === 'raise') {
        this.potService.updatePot(amount, this.potInfoElement)
        this.updateChips(amount, element)
      }
    } else {
      if (group.childNodes.length > 0) {
        var chipsAmount = 0
        for (const chipImage of group.querySelectorAll('image')) {
          var chipNominal = parseFloat(chipImage.getAttribute('href').match('\\/\\d+(\\.\\d{2})?')[0].replace('/', ''))
          if (chipNominal >= 1) {
            chipNominal = Math.floor(chipNominal)
          }
          chipsAmount += chipNominal
        }

        // remove previous chips stack and amount
        group.querySelector('g.playerChipsOnTableInfo').remove()
        this.potService.clearChips(group)

        if (action === 'call') {
          amount += chipsAmount
        } else if (action === 'raise') {
          this.potService.updatePot(amount - chipsAmount, this.potInfoElement)
          this.updateChips(amount - chipsAmount, element)
        } else if (action === 'uncalledBet') {
          this.potService.updatePot(-amount, this.potInfoElement)
          this.updateChips(-amount, element)
          amount = chipsAmount - amount
        }
      }
    }
    var chipPile = this.potService.getChipsFor(amount)
    var diffY = 0

    var chipsDetailsGroup = document.createElementNS(this.svgNS, 'g')
    chipsDetailsGroup.setAttribute('class', 'playerChipsOnTableInfo')
    for (var i = 0; i < chipPile.length; i++) {
      var chipImage = document.createElementNS(this.svgNS, 'image')
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
      chipImage.setAttribute('width', '38')
      chipImage.setAttribute('height', '35')
      group.appendChild(chipImage)
      diffY += 6
    }
    var lowermostChip = group.querySelector('image')

    if (amount > 0) {
      var chipsAmountText = document.createElementNS(this.svgNS, 'text')
      var chipsAmountBackground = document.createElementNS(this.svgNS, 'rect')
      if (amount % 1 !== 0) {
        chipsAmountText.textContent = '$' + amount.toFixed(2)
      } else {
        chipsAmountText.textContent = amount
      }
      chipsAmountText.setAttribute('class', 'betAmount')
      chipsAmountBackground.setAttribute('class', 'chipsBackground')

      chipsDetailsGroup.appendChild(chipsAmountBackground)
      chipsDetailsGroup.appendChild(chipsAmountText)
      group.appendChild(chipsDetailsGroup)

      chipsAmountBackground.setAttribute('width', chipsAmountText.getBoundingClientRect().width + 10)
      chipsAmountBackground.setAttribute('height', chipsAmountText.getBoundingClientRect().height + 10)
      chipsAmountText.setAttribute('y', parseInt(chipsAmountBackground.getBoundingClientRect().height) / 1.5)
      chipsAmountText.setAttribute('x', (chipsAmountBackground.getAttribute('width') - chipsAmountText.getBoundingClientRect().width) / 2)
      chipsDetailsGroup.setAttribute('transform', 'translate(' + (parseInt(lowermostChip.getAttribute('x')) - ((parseInt(chipsAmountBackground.getAttribute('width')) - lowermostChip.getBoundingClientRect().width) / 2)) + ', ' + (parseInt(lowermostChip.getAttribute('y')) + parseInt(lowermostChip.getBoundingClientRect().height)) + ')')
    }
  }

  displayComment (comment, username, element) {
    var actionText = element.getElementsByTagName('text')[0]
    var nextButton = document.getElementById('nextButton')
    nextButton.setAttribute('disabled', 'disabled')
    actionText.textContent = comment
    setTimeout(function () {
      actionText.textContent = username
      nextButton.removeAttribute('disabled')
    }, 750)
  }

  updateChips (amount, element) {
    var chipsElement = element.querySelector('text.playerChips')
    var chips = parseFloat(chipsElement.textContent.replace('$', ''))
    if (Object.is(chips, NaN)) chips = 0
    chips -= amount
    if (chips === 0) {
      chipsElement.textContent = 'ALL-IN'
    } else {
      if (chips % 1 !== 0) {
        chipsElement.textContent = '$' + chips.toFixed(2)
      } else {
        chipsElement.textContent = chips
      }
    }
  }

  getSeat (username) {
    var seatToAct
    for (const seat of this.seats) {
      if (seat.querySelector('text').textContent === username) {
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
}

export default new ReplayService()
