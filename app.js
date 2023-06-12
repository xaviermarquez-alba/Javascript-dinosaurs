// Create Dino Constructor
function Dinosaur({ species, weight, height, diet, where, when, fact }) {
    this.species = species
    this.weight = weight
    this.height = height
    this.diet = diet
    this.where = where
    this.when = when
    this.fact = fact
}

Dinosaur.prototype.getImagePath = function () {
    return `./images/${this.species.toLowerCase()}.png`
}

// Create Dino Compare Method 1
// NOTE: Weight in JSON file is in lbs, height in inches.

Dinosaur.prototype.compareWeight = function (human) {
    const weightDiff = this.weight - human.weight
    if (weightDiff > 0) {
        this.fact = `Dinosaur ${this.species} is ${weightDiff} lbs heavier`
    } else if (weightDiff < 0) {
        this.fact = `Dinosaur ${this.species} is ${weightDiff} lbs lighter`
    } else {
        this.fact = `Dinosaur ${this.species} is the same weight as the human`
    }
}

// Create Dino Compare Method 2
// NOTE: Weight in JSON file is in lbs, height in inches.

Dinosaur.prototype.compareHeight = function (human) {
    const heightDiff = this.weight - human.weight
    if (heightDiff > 0) {
        this.fact = `Dinosaur ${this.species} is ${heightDiff} taller`
    } else if (heightDiff < 0) {
        this.fact = `Dinosaur ${this.species} is ${heightDiff} shorter`
    } else {
        this.fact = `Dinosaur ${this.species} is the same height as the human`
    }
}

// Create Dino Compare Method 3
// NOTE: Weight in JSON file is in lbs, height in inches.

Dinosaur.prototype.compareDiet = function (human) {
    if (this.diet === human.diet) {
        this.fact = `Dinosaur ${this.species} have the same diet as the human`
    } else {
        this.fact = `Dinosaur ${this.species} is ${this.diet} but the human is ${human.diet}`
    }
}
// Create Dino Objects
const dinosaur = new Dinosaur({})

// Create Human Object
function Human({ name, height, weight, diet }) {
    this.species = 'Human'
    this.name = name
    this.height = height
    this.weight = weight
    this.diet = diet
}

Human.prototype.getImagePath = function () {
    return `./images/${this.species.toLowerCase()}.png`
}

function convertToInches(feet, inches) {
    return feet * 12 + inches
}

// Use IIFE to get human data from form
const getHumanDataForm = (function () {
    function getDataForm() {
        return {
            name: document.querySelector('#name').value,
            height: convertToInches(
                document.querySelector('#feet').value,
                document.querySelector('#inches').value
            ),
            weight: document.querySelector('#weight').value,
            diet: document.querySelector('#diet').value,
        }
    }

    return getDataForm
})()

// Generate Tiles for each Dino in Array
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        // Generate random index
        let j = Math.floor(Math.random() * (i + 1))

        // Swap elements array[i] and array[j]
        ;[array[i], array[j]] = [array[j], array[i]]
    }
    return array
}

const generateTile = (dinos, human) => {
    let tiles = []
    shuffleArray(dinos)
    let counter = 0
    const dinosSelected = dinos.filter((dino) => {
        counter++
        return dino.species !== 'Pigeon' || counter < 7
    })

    const pigeon = dinos.find((dino) => dino.species === 'Pigeon')
    dinosSelected.push(pigeon)

    // list of facts shuffled
    const factList = dinos
        .map((dino) => {
            if (dino.species !== 'Pigeon') {
                return dino.fact
            }
        })
        .filter((fact) => fact !== undefined)

    shuffleArray(factList)
    // add facts to dinos
    dinosSelected.forEach((dino, i) => {
        if (dino.species === 'Pigeon') {
            dino.fact = 'All birds are Dinosaurs.'
        } else {
            dino.fact = factList.pop()
        }

        // first 3 facts from human comparison
        switch (i) {
            case 0:
                dino.compareHeight(human)
                break
            case 1:
                dino.compareWeight(human)
                break
            case 2:
                dino.compareDiet(human)
                break
        }

        // fixed fact for pigeon

        tiles.push(dino)
    })

    // Add Human in the middle
    tiles.splice(4, 0, human)
    console.log(tiles)
    tiles.forEach((element) => {
        addTiles(element)
    })
}

// Add tiles to DOM
const addTiles = (element) => {
    const div = document.createElement('div')
    div.className = 'grid-item'

    document.querySelector('#grid').appendChild(div)
    const h3 = document.createElement('h3')
    h3.textContent =
        element.species !== 'Human' ? element.species : element.name
    div.appendChild(h3)

    const img = document.createElement('img')
    img.src = element.getImagePath()
    div.appendChild(img)

    const p = document.createElement('p')
    p.textContent = element.species !== 'Human' ? element.fact : "I'm a human"
    div.appendChild(p)
}

// On button click, prepare and display infographic
const compareHumanDinosaurs = async () => {
    document.querySelector('#dino-compare').style.display = 'none'

    const dinoData = await fetch('./dino.json')
        .then((response) => response.json())
        .then((data) =>
            data.Dinos.map((dino) => {
                return new Dinosaur(dino)
            })
        )

    const human = new Human(getHumanDataForm())
    generateTile(dinoData, human)
}

const compare_button = document.querySelector('#btn')
compare_button.addEventListener('click', compareHumanDinosaurs)
