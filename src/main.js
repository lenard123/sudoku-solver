import Solver from './solver.js'
import Cell from './cell.js'

const cells = Array(81).fill().map((_, id) => new Cell(id))
const solver = new Solver(cells)

const attachCells = (board) => {
    cells.reduce((acm, cell, i) => {
        if (i % 9 === 0) {
            acm = document.createElement('tr')
            board.appendChild(acm)
        }
        acm.appendChild(cell.element)
        return acm
    }, null)
}

const handleSubmit = (e) => {
    e.preventDefault()

    const formData = new FormData(e.target)
    const speed = Number(formData.get('speed'))
    const random = Boolean(Number(formData.get('random')))

    solver.options.speed = speed
    solver.options.random = random

    solver.solve()
}

window.addEventListener('load', () => {
    const form = document.getElementById('form')
    const stopBtn = document.getElementById('stop')
    const board = document.getElementById('board')

    form.addEventListener('submit', handleSubmit)

    stopBtn.addEventListener('click', () => {
        if (solver.isRunning()) {
            solver.pause()
            stopBtn.textContent = 'Continue'
        } else {
            solver.continue()
            stopBtn.textContent = 'Pause'
        }
    })

    solver.onStart = function() {
        stopBtn.style.display = ''
    }

    solver.onFinish = function() {
        console.log('Finish')
        stopBtn.style.display = 'none'
    }

    attachCells(board)
})
window.solver = solver