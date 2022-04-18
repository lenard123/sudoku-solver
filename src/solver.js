
const sleep = (delay) => new Promise(resolve => setTimeout(resolve, delay))

const invoke = (callback) => {
    if (typeof callback === 'function') {
        callback()
    }
}

function Solver(cells, options = {})
{
    this.options = Object.assign({speed: 0, random: false}, options)
    this.cells = cells
    this.thread = null
    this.stopThread = false
    this.paused = false
    this.running = false
}

Solver.prototype.clearData = function() {
    this.paused = false
    this.cells.forEach(cell => cell.setValue(null))
}

Solver.prototype.wait = function() {
    let promise = new Promise(resolve => {
        const check = () => {
            if (!this.paused) {
                resolve()
            } else {
                setTimeout(() => {
                    check()
                }, 0)
            }
        }
        check()
    })
    console.log(promise)
    return promise
}

Solver.prototype.finally = function () {
    invoke(this.onFinish)
}

Solver.prototype.populate = async function (depth = 0) {
    if (depth === 0) {
        console.log('Solver Started')
    }

    if (this.stopThread) {
        this.thread = null
        this.stopThread = false
        this.finally()
        throw 'Solver Stopped!'
    }

    if (this.paused) {
        await this.wait()
    }

    const emptyCells = this.getEmptyCells()

    for(let cell of emptyCells){
        const validValues = this.getValidValues(cell)
        for(let value of validValues) {
            cell.setValue(value)
            await sleep(this.options.speed)
            if (await this.populate(depth + 1)) {
                return true
            }
            cell.setValue(null)
        }
        return false
    }

    this.thread = null
    this.finally()
    return true    
}

Solver.prototype.solve = function() {
    this.stop()
    setTimeout(() => {
        this.clearData()
        this.running = true

        invoke(this.onStart)

        this.thread = this.populate()
    }, this.options.speed)
}

Solver.prototype.stop = function() {
    this.running = false
    if (this.thread !== null) {
        this.stopThread = true
    }
}

Solver.prototype.getValidValues = function (cell) {
    
    const validValues = [1,2,3,4,5,6,7,8,9]

    return validValues.filter(value => {

        for(let cellItem of this.cells) {
            if (cellItem.row === cell.row && cellItem.value === value) return false;
            if (cellItem.col === cell.col && cellItem.value === value) return false;
            if (cellItem.block === cell.block && cellItem.value === value) return false;
        }

        return true
    }).sort(() => {
        if (this.options.random) {
            return Math.random() - 0.5
        }
        return -1
    })

}

Solver.prototype.pause = function() {
    this.paused = true
}

Solver.prototype.continue = function() {
    this.paused = false
}

Solver.prototype.isRunning = function () {
    return this.running && !this.paused
}

Solver.prototype.getEmptyCells = function() {
    return this.cells.filter((cell) => cell.isEmpty())
}

export default Solver