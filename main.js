class Upgrades {
    constructor() {
        this.cpsUpgrades = [];
        this.clickUpgrades = [];
    }
}

class CpsUpgrade {
    constructor(cps){
        this.cps = cps;
    }
}

class ClickUpgrade {
    constructor(clickValue){
        this.clickValue = clickValue;
    }
}

class CpsUpgradeFetch {
    constructor(id, cost) {
        this.id = id;
        this.cost = cost;
    }
    cps() {
        switch (this.id) {
            case 1:
                return 1;
            case 2:
                return 5;
            case 3:
                return 20;
            case 4:
                return 100;
            case 5:
                return 500;
            case 6:
                return 1000;            
            default:
                return 0;
        }
    }
}

class ClickUpgradeFetch {
    constructor(id, cost) {
        this.id = id;
        this.cost = cost;
    }
    clickValue() {
        switch (this.id) {
            case 1:
                return 1;
            case 2:
                return 10;
            case 3:
                return 100;
            case 4:
                return 1000;
            case 5: 
                return 10000;
            default:
                return 0;
        }
    }
}

const cppImg = document.querySelector('#clicker');
const clickCounter = document.getElementById('click-count');
const upg = document.getElementById('upgrade');

const resetButton = document.getElementById('reset-button');

const cpsCount = document.getElementById('cps-count');
const clickValueCount = document.getElementById('click-value');

clickCounter.textContent = 'Clicks: 0';

const upgradesHTML = document.querySelectorAll(".upgrade-image");

const upgrades = new Upgrades();

let clickCountValue = 0;

let totalCps = 0;
let clickValue = 1;

if(localStorage.getItem('clickCount')) {
    clickCountValue = Number(localStorage.getItem('clickCount'));
    updateClickCountText();
}



const savedCpsUpgrades = localStorage.getItem("cpsUpgrades");
const savedClickUpgrades = localStorage.getItem("clickUpgrades");

if (savedCpsUpgrades !== null) {
    upgrades.cpsUpgrades = JSON.parse(savedCpsUpgrades);
    updateTotalCps();
}

if (savedClickUpgrades !== null) {
    upgrades.clickUpgrades = JSON.parse(savedClickUpgrades);
    updateClickValue();
}






cppImg.addEventListener('click', () => {
    clickCountValue += clickValue;
    updateClickCountText();
    saveGame();
});



upgradesHTML.forEach(upgrade => {
    upgrade.addEventListener("click", event => {
        const clickedUpgrade = event.currentTarget;
        const upgradeId = clickedUpgrade.dataset.id;

        buyUpgrade(upgradeId, clickedUpgrade);
    });
});

resetButton.addEventListener('click', () => {
    clickCountValue = 0;
    totalCps = 0;
    clickValue = 1;
    upgrades.cpsUpgrades = [];
    upgrades.clickUpgrades = [];
    updateClickCountText();
    updateStatsText()
    saveGame();
});

setInterval(() => {
    clickCountValue += totalCps;
    updateClickCountText();
    saveGame();
}, 1000);

function saveGame(){
    localStorage.setItem('clickCount', clickCountValue);
    localStorage.setItem('cpsUpgrades', JSON.stringify(upgrades.cpsUpgrades));
    localStorage.setItem('clickUpgrades', JSON.stringify(upgrades.clickUpgrades));
}

function updateStatsText() {
    cpsCount.textContent = `Clicks per second: ${totalCps}`;
    clickValueCount.textContent = `Click value: ${clickValue}`;
}

function updateClickCountText() {
    clickCounter.textContent = `Clicks: ${clickCountValue}`;
}

function buyUpgrade(upgradeId, clickedUpgrade) {
    const upgradeCost = parseInt(clickedUpgrade.dataset.cost);
    const upgradeType = clickedUpgrade.dataset.type;


    if(clickCountValue >= upgradeCost) {
        clickCountValue -= upgradeCost;
        clickCounter.textContent = `Clicks: ${clickCountValue}`;

        if(upgradeType === "cps") {
            const cpsUpgradeValue = new CpsUpgradeFetch(parseInt(upgradeId), upgradeCost);
            const cpsUpgrade = new CpsUpgrade(cpsUpgradeValue.cps());
            upgrades.cpsUpgrades.push(cpsUpgrade);
            updateTotalCps();
            return;
        }

        if(upgradeType === "click") {
            const clickUpgradeValue = new ClickUpgradeFetch(parseInt(upgradeId), upgradeCost);
            const clickUpgrade = new ClickUpgrade(clickUpgradeValue.clickValue());
            upgrades.clickUpgrades.push(clickUpgrade);
            updateClickValue();
            return;
        }
    }
}

function updateTotalCps() {
    let cpsSum = 0;
    upgrades.cpsUpgrades.forEach(upgrade => {
        cpsSum += upgrade.cps;
    });
    totalCps = cpsSum;
    updateStatsText()
}

function updateClickValue() {
    let clickSum = 1;
    upgrades.clickUpgrades.forEach(upgrade => {
        clickSum += upgrade.clickValue;
    });
    clickValue = clickSum;
    updateStatsText()
}

