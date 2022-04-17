const DOMreference = []
const data = []


const initializeTable = () => {
    const board = document.getElementById('board')
    for(let row = 0; row < 9; row++)
    {
        let rowElement = document.createElement('tr')
        for (let col = 0; col < 9; col++) {
            let cell = document.createElement('td')
            rowElement.appendChild(cell)
            data.push(null)
            DOMreference.push(cell)
        }
        board.appendChild(rowElement)
    }
}

const clearData = () => {
    for(let i = 0; i < 81; i++)
    {
        data[i] = null
    }
    render()
}

const getRows = (id) => {
    const rows = []
    const offset = Math.floor(id / 9) * 9
    for(let rowId = offset; rowId < offset+9; rowId++)
    {
        if (data[rowId] !== null) rows.push(data[rowId])
    }
    return rows
}

const getCols = (id) => {
    const cols = []
    const start = id % 9
    for (let i = 0; i < 9; i++)
    {
        const colId = start+(i*9)
        if (data[colId] !== null) cols.push(data[colId])
    }
    return cols
}

const getBlocks = (id) => {
    const blocks = []
    const rowOffset = Math.floor ( (id % 9) / 3) * 3
    const colOffset = Math.floor ( id / (27) ) * 27
    const start = rowOffset + colOffset
    for (let i = 0; i < 9; i++)
    {
        let blockId = (9*Math.floor(i / 3)) + (i % 3) + start
        if (data[blockId] !== null) blocks.push(data[blockId])
    }
    return blocks
}

const checkIfValidRow = (id, value) => {
    const rows = getRows(id)
    return rows.every(row => row !== value)
}

const checkIfValidCol = (id, value) => {
    const cols = getCols(id)
    return cols.every(col => col !== value)
}

const checkIfValidBlock = (id, value) => {
    const blocks = getBlocks(id)
    return blocks.every(block => block !== value)
}

const getValidValues = (id) => {
    const valid = []
    const value = data[id]
    if (value !== null) return valid;

    for (var i = 1; i <= 9; i++)
    {
        if (
            checkIfValidRow(id, i) &&
            checkIfValidCol(id, i) &&
            checkIfValidBlock(id, i)
        ) valid.push(i)
    }
    return valid.sort(() => Math.random() - 0.5)
}

const getEmptyBlocks = () => {
    return data.reduce((acm, data, index) => {
        if (data === null) {
            acm = [...acm, index]
        }
        return acm
    }, [])
}

const render = () => {
    data.forEach( (value, i) => {
        DOMreference[i].textContent = value
    })
}

const isSolve = () => {
    const emptyIds = getEmptyBlocks()
    return emptyIds.length > 0
}

const sleep = (delay) => new Promise(resolve => setTimeout(resolve, delay))

const populate = (id, values, index = 0) => {
    if (index >= values.length) return false

    data[id] = values[index]

    render()

    if (!solve()) {
        return populate(id, values, index = 1)
    }

}

const findCorrectValue = (id, values) => {
    for(var i in values){
        const value = values[i]

    }
}

window.stop = false

const solve = () => {
    console.count('Solve')
    const emptyIds = getEmptyBlocks()

    if (emptyIds.length === 0) return true

    for(var i in emptyIds) {

        const id = emptyIds[i]        
        const validValues = getValidValues(id)

        for (var j in validValues) {
            const value = validValues[j]

            //test
            data[id] = value
            render()
            if (solve()) {
                return true
            }
            data[id] = null

        }

        return false

    }

}

window.clearData = clearData
window.solve = solve
window.addEventListener('load', initializeTable)
document.getElementById('btnStart').addEventListener('click', function () {
    clearData()
    console.countReset('Solve')
    solve()
})