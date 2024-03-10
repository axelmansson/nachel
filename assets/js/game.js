class Session {
    game = null
    remainingHeart = 10
    ended = false
    difficulty = null

    /**
     * @type {import("./types.d").Player}
     */
    player = null
    score = 0

    constructor(difficulty = 'ease') {
        this.difficulty = difficulty
    }

    setPlayer(player) {
        this.player = player
    }

    setScore(score) {
        this.score += score
    }

    addHeart() {
        if(this.remainingHeart === 10) return;
        this.remainingHeart++;
    }

    removeHeart() {
        if(this.remainingHeart) {
            this.remainingHeart--;
        }

        console.log({remainingHeart: this.remainingHeart})
        // player is out of heart
        if(!this.remainingHeart) {
            this.won = false;
            this.player.logSession(this)
            this.ended = true

            // letting game know the game session is over
            return true;
        }
    }

    async askPlayerInfo() {
        return new Promise((resolve) => {
            $('#player-name-modal').remove()
            const $wrapper = $('<div id="player-name-modal" />')
            const $closeButton = $('<span class="close">x</span>')
            const $playerNameBox = $(`<div>
                <label for="player-name">Enter your name to save score</label>
            </div>`)
            $playerNameBox.prepend($closeButton)
            const $playerNameInput = $('<input id="player-name" value="" name="player-name" type="text" />')

            const $savePlayerInfoButton = $('<button>Save</button>')
            const saveAndClose = (event) => {
                if(event.type === 'keypress' && event.key !== 'Enter') {
                    return;
                }
                
                this.player = new Player($playerNameInput.val())
                $wrapper.remove()

                resolve(true)
            }

            $savePlayerInfoButton.on('click', saveAndClose)
            $playerNameInput.on('keypress', saveAndClose)

            $closeButton.on('click', () => {
                $wrapper.remove()
            })

            $playerNameBox.append($playerNameInput)
            $playerNameBox.append($savePlayerInfoButton)

            $wrapper.append($playerNameBox)

            $('body').append($wrapper)
            $playerNameInput.focus()
        })
    }

    endGame() {
        this.won = true
        this.ended = true
        this.setScore(this.remainingHeart * 2)
        this.player.logSession(this)
        console.log('end game', this.score)
    }
}

class Player {
    name = null;
    totalScore = 0
    highScore = 0
    wins = 0
    loss = 0

    sessions = []

    /**
     * @param {string} name
     */
    constructor(name) {
        this.name = name
    }

    /**
     * @type {import("./types.d").logSession}
     */
    logSession(session) {
        this.sessions.push(session)
        this.setScore(session.score)

        if(session.won) {
            this.won++;
        } else {
            this.loss++;
        }
    }

    /**
     * @description sets the score to player profile
     * @param {number} score 
     */
    setScore(score) {
        this.totalScore += score;

        if(score > this.highScore) {
            this.highScore = score;
        }
    }
}


/**
 * @type {import("./types.d").Game}
 */
class Game {
    name = "Nachel - Axel's Word Game"

    /**
     * @type {import("./types.d").Word}
     */
    currentWord = null
    theme = null
    currentLevel = 0
    correctLetters = []

    /**
     * @type {import("./types.d").Session}
     */
    session = null

    // elements
    gameFrame = null
    welcomeScreen = null
    winningScreen = null
    gamesOverScreen = null
    skipButton = null
    nextButton = null
    navBar = null

    constructor() {
        this.gameFrame = $('<div id="game-frame" />')
        this.welcomeScreen = $('<div id="welcome-screen" />')
    
    }

    getLogo() {
        return $(`<div class="logo">
            <img src="./assets/images/logo.png" alt="Axel Word Game">
        </div>`)
    }

    getFactBar() {
        return $(`<div class="facts-bar">
            <div class="remaining-hearts">
                <img src="./assets/images/boy.png" alt="" srcset="">
                <span>${this.session.player.name}</span>
            </div>

            <div class="remaining-hearts">
                <img src="./assets/images/heart.gif" alt="" srcset="">
                <span>${this.session.remainingHeart}</span>
            </div>
    
            <div class="total-score">
                <img src="./assets/images/score.png" alt=""> 
                <span>${this.session.score}</span>
            </div>

            <div class="level">
                <img src="./assets/images/level.png" alt=""> 
                <span>${this.currentLevel}</span>
            </div>
        </div>`)
    }

    renderGameNavbar() {
        $('.game-navbar').remove()
        const $gameNavbar = $('<div class="game-navbar" />')
    
        $gameNavbar.append(this.getLogo())
        $gameNavbar.append(this.getFactBar())
        
        $('body').prepend($gameNavbar);
    }
    
    showGameFrame() {
        this.welcomeScreen.remove()
        $('body').append(this.gameFrame)
    }
    
    setPlayIconEvent() {
        $('.play-icon').eq(0)
            .off('click')
            .on('click', () => {
                // this.startNewSession()
                // console.log("Hi Axel!")
                this.showDifficultyMenu()
            })
    }

    /**
     * @type {import("./types.d").setTheme}
     */
    setTheme(themeName) {
        $('body').attr('class', `themed ${themeName}`)
    }

    showDifficultyMenu() {
        $(".diffculty-menu").remove()
        const $diffcultyMenu = $('<div class="difficulty-menu" />')
        const difficultyLevels = ['easy', 'medium', 'hard']
        difficultyLevels.forEach(level => {
            $(`<button data-level="${level}">${level}</button>`).appendTo($diffcultyMenu).on('click', (event) => {
                this.startNewSession(level)
                $diffcultyMenu.remove()
            })
        })

        $diffcultyMenu.appendTo('body')
        this.welcomeScreen.remove()
        $('#games-over-screen').remove()
    }
    
    showWelcomeScreen() {
        const $playButton = $('<div class="play-icon" />')
        $playButton.html(`<img src="./assets/images/play.png" />`)
    
        this.welcomeScreen.html(this.getLogo())
    
        this.welcomeScreen.append($playButton)
        $('body').append(this.welcomeScreen)
    
        this.setPlayIconEvent()
    }
    
    async startNewSession(difficulty = 'easy') {
        this.gamesOverScreen?.remove()
        this.showGameFrame()
        this.correctLetters = []

        this.gameFrame.html('<img src="./assets/images/loading.svg" />')
        
        if(!this.session || this.session.ended) {
            this.session = new Session(difficulty)
            await this.session.askPlayerInfo()
        }

        this.currentWord = await getNewImage(difficulty)
    
        this.gameFrame.html(`<p>What does this image describe?</p>
            <div class="image-wrapper">
                <img id="image-element" src="${this.currentWord.url}" />
            </div>
            <div class="box-wrapper" id="box-wrapper">
                
            </div>
        `)  
    
        // create workspace
        this.showSkipButton()
        this.renderGameNavbar()
    
        // add interactivity
        this.generateLetterBoxes(this.currentWord.name)
        this.listenForKeyPress()
    }
    
    showSkipButton() {
        const $skipButton = $('<button class="nav-button" id="skip-button" />')
        $skipButton.html('Skip')
    
        $skipButton.on('click', () => this.startNewSession())
    
        this.gameFrame.append($skipButton)
    }
    
    showNextButton() {
        $('#next-button').remove()
        const $nextButton = $('<button class="nav-button" id="next-button" />')
        $nextButton.html('next')
    
        $nextButton.on('click', () => this.startNewSession())
    
        this.gameFrame.append($nextButton)
    }
    
    showWinnerScreen() {
    }
    
    showGamesOverScreen() {
        this.gameFrame.remove()
        this.gamesOverScreen?.remove()

        this.gamesOverScreen = $('<div id="games-over-screen" />')
        const $startOverButton = $('<button>Start Over</button>')
        const $factsBox = $(`<div class="facts-box">
            You're reached level <span>${this.currentLevel}</span> and received <span>${this.session.score}</span> 😊
        </div>`)
        
        this.gamesOverScreen.append($factsBox)
        
        if(!this.session.won) {
            const $gamesOverBox = $(`<div id="games-over-box">
                But you're out of heart 😉
            </div>`)
            this.gamesOverScreen.append($gamesOverBox)
        }

        this.gamesOverScreen.append($startOverButton)
        $startOverButton.on('click', () => this.showWelcomeScreen())

        $('body').append(this.gamesOverScreen)
    }

    listenForKeyPress() {
        // jQuery = $
        $(document).off('keyup').on('keyup', (event) => {
            const pressedKey = event.key;
            if(pressedKey.length > 1 || !pressedKey.match(/^[A-Za-z]+$/)) return;

            const $allTarget = $(`[data-char=${pressedKey}]`);
            $allTarget.each((index, el) => {
                console.log(el)
                $(el).html(pressedKey.toUpperCase())
            })
            
            this.calculateScore(pressedKey)
        })
    }

    calculateScore(pressedKey) {
        const correctChars = this.currentWord.name.split('').filter(char => char === pressedKey)
        if(!correctChars?.length) {
            const gamesOver = this.session.removeHeart()

            if(gamesOver) {
                $(document).off('keyup')
                this.showGamesOverScreen()
            }
        }
        
        if(!this.correctLetters.includes(pressedKey)) {
            this.correctLetters = [
                ...this.correctLetters,
                ...correctChars
            ];
        }

        this.renderGameNavbar()

        if(this.currentWord.name.length === this.correctLetters.length) {
            // player wins
            this.currentLevel++;
            this.session.setScore((this.correctLetters.filter(letter => this.currentWord.name.lastIndexOf(letter) === this.currentWord.name.indexOf(letter)).length + 1) * 5)

            if(this.currentLevel === 10) {
                $(document).off('keyup')
                this.session.endGame()
                this.showGamesOverScreen()
            } else {
                this.session.addHeart()
                this.showNextButton()
            }

        }
    }
    
    generateLetterBoxes() {
        const $boxWrapperEl = $('#box-wrapper')
        $boxWrapperEl.html('');

        for(let i = 0; i < this.currentWord.name.length; i++) {
            const $span = $('<span />').attr('data-char', this.currentWord.name[i].toLocaleLowerCase())
            $boxWrapperEl.append($span)
        }
    }
}