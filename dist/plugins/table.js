class Table {
  constructor(coordinates) {
    this.startX = coordinates.startX
    this.startY = coordinates.startY
    this.rectTop = coordinates.rectTop
    this.rectRight = coordinates.rectRight
    this.rectBottom = coordinates.rectBottom
    this.rectLeft = coordinates.rectLeft
  }

  reset() {
    this.startX = 0
    this.startY = 0
    this.rectTop = 0
    this.rectRight = 0
    this.rectBottom = 0
    this.rectLeft = 0
  }
}

class DomTable {
  constructor(pageNode, coordinates) {
    this.pageNode = pageNode
    this.table = null
  }

  bindTable(coordinates) {
    this.table = new Table(coordinates)
  }

  paint() {
    console.log('paint')
    let div = document.createElement('div')
    div.id = self.selector
    div.className = 'div'
    div.style.left = `${this.table.startX}px`
    div.style.top = `${this.table.startY}px`
    this.pageNode.appendChild(div)
  }

  getStartCoordinateFromEvent(event, viewerContainer) {
    let scrollTop = viewerContainer.scrollTop
    let scrollLeft = viewerContainer.scrollLeft
    let startX = event.clientX + scrollLeft
    let startY = event.clientY + scrollTop
    return {startX, startY}
  }

  get selector() {
    return `page${this.pageNode.dataset('pageNumber')}Table`
  }
}

DomTable.prototype.viewerContainerID = 'viewerContainer'

function mouseDownListener(e) {
  console.log('mouseDownListener')
  // let pageNode = e.target.closest('.page')
  // console.log(pageNode)
  // console.log(pageNode.dataset.pageNumber)
  // console.log(pageNode.dataset('pageNumber'))
  // if has rect delete it
  // find page dom
  // if not page return
}

function mouseUpListener(e) {
  console.log('mouseUpListener')
  // let pageNode = e.target.closest('.page')
  // console.log(pageNode.dataset.pageNumber)
  // let viewerContainer = document.getElementById('viewerContainer')
  // let start = getStartCoordinateFromEvent(e, viewerContainer)
  // console.log(start)
}

export default class TablePlugin {
  register() {
    console.log('resister', this.name)
    TablePlugin.bindWindowEvents()
  }

  deregister() {
    console.log('deresister', this.name)
    TablePlugin.unbindWindowEvents()
  }

  static bindWindowEvents() {
    document.addEventListener('mousedown', mouseDownListener)
    document.addEventListener('mouseup', mouseUpListener)
  }

  static unbindWindowEvents() {
    document.removeEventListener('mousedown', mouseDownListener)
    document.removeEventListener('mouseup', mouseUpListener)
  }
}

TablePlugin.prototype.name = 'table'
