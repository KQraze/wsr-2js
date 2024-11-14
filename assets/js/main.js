let game = {};

const gameConfig = {
    BOTTOM_POINT: innerHeight - 120,
    SPEED_COEFFICIENT: 60 / getFps()
}

const currentUser = {
    name: localStorage.getItem('username') || '',
    character: null
}
let currentView = 'start';

const $ = (selector) => document.querySelector(selector);
const $all = (selector) => document.querySelectorAll(selector);

const go = (page) => {
    const views = ['start', 'game', 'end'];
    currentView = page;
    $(`#${currentView}`).classList.remove('d-none');
    $(`#${currentView}`).classList.add('d-flex');

    if (currentView === 'game') {
        $all('.element').forEach((elem) => elem.remove());
    }

    views.forEach((view) => {
        if (view !== currentView) {
            $(`#${view}`).classList.remove('d-flex');
            $(`#${view}`).classList.add('d-none');
        }
    })
}

const actionsOnClick = () => {
    document.onclick = (e) => {
        e.preventDefault();
        switch (e.target.id) {
            case 'reset-btn':
            case 'startGame': go('game');
        }
    }
}

const isDisabledStartButton = () => !currentUser.name || !currentUser.character;

function getFps() {
    const fps = localStorage.getItem('fps') ?? +prompt('Введите частоту кадров вашего монитора', '60')
    localStorage.setItem('fps', fps);
    return fps;
}

function getRandom(min, max) {
    min = Math.ceil(min)
    max = Math.floor(max)

    return Math.floor(Math.random()*(max-min+1)) + min
}

$('#nameInput').oninput = (e) => {
    currentUser.name = e.target.value;

    localStorage.setItem('username', currentUser.name);
    $('#startGame').disabled = isDisabledStartButton();
}

$('#select-mario').onclick = () => {
    currentUser.character = 'mario'
    $('#select-mario').classList.add('card_selected');
    $('#select-luigi').classList.remove('card_selected');
    $('#startGame').disabled = isDisabledStartButton();
}

$('#select-luigi').onclick = () => {
    currentUser.character = 'luigi'
    $('#select-mario').classList.remove('card_selected');
    $('#select-luigi').classList.add('card_selected');
    $('#startGame').disabled = isDisabledStartButton();
}

window.onload = () => {
    actionsOnClick();
    $('#nameInput').value = currentUser.name;
    $('#startGame').disabled = isDisabledStartButton();


    setInterval(() => {
        if (currentView === 'game') {
            game = new Game(currentUser);
            game.start();
            currentView = 'game process'
        }
    }, 100)
}