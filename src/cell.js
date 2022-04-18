
function getBlock(id) {
    const rowOffset = Math.floor ( (id % 9) / 3) * 3
    const colOffset = Math.floor ( id / (27) ) * 27
    return rowOffset + colOffset
}

function Cell(id)
{
    this.value = null
    this.id = id
    this.element = document.createElement('td')
    this.element.addEventListener('click', this.clickHandler)
    this.col = id % 9
    this.row = Math.floor( this.id / 9 )
    this.block = getBlock(id)
}

Cell.prototype.clickHandler = function(e) {
    console.log(e.target)
};

Cell.prototype.setValue = function (value) {
    this.value = value
    this.element.textContent = value
}

Cell.prototype.isEmpty = function() {
    return this.value === null
}

export default Cell