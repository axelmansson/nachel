function showDifficultyMenu() {
    const $diffcultyMenu = $('<div class="diffculty-menu" />')
    const difficultyLevels = ['easy', 'medium', 'hard']
    difficultyLevels.forEach(level => {
        $(`<button>${level}</button>`).appendTo($diffcultyMenu)
    })

    $diffcultyMenu.appendTo('body')
}

$(document).ready(() => {
    const game = new Game()
    game.showWelcomeScreen()
})