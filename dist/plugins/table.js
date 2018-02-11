let isCurPage = (e) => {
  const curTargetId = e.target.id
  const curPages = [
    'curRect',
    'middleDiv',
    'rRightDown',
    'rLeftDown',
    'rRightUp',
    'rLeftUp',
    'rRight',
    'rLeft',
    'rDown',
    'rUp',
    'menuDiv',
    'createTable',
    'rows',
    'coloums'
  ]
  return curPages.includes(curTargetId)
}

let findPageNode = (node) => {
  return node.closest('.page')
}

let judgePageSize = (node) => {
  const width = parseInt(node.style.width.replace('px', ''))
  const height = parseInt(node.style.height.replace('px', ''))
  return width > 30 && height > 30
}

let getTop = (node) => {
  let offset = node.offsetTop
  if (node.offsetParent !== null) offset += getTop(node.offsetParent);
  return offset
}

let getStyle = (obj, attr) => {
  if (!obj) return ''
  if (obj.currentStyle) {
    return obj.currentStyle[attr]
  }
  else {
    return document.defaultView.getComputedStyle(obj, null)[attr]
  }
}

class DomTable {
  constructor(pageNode) {
    this.pageNode = pageNode
    this.canvasNode = this.pageNode.querySelector('.canvasWrapper')
  }

  paint(coordinates, className) {
    console.log('paint')
    let tableContainer = document.createElement('div')
    tableContainer.id = 'tableBorder'
    tableContainer.className = 'table_border ' + className;
    tableContainer.style.left = `${coordinates.rectLeft}px`
    tableContainer.style.top = `${coordinates.rectTop}px`
    tableContainer.style.width = `${coordinates.rectWidth}px`
    tableContainer.style.height = `${coordinates.rectHeight}px`
    tableContainer.style.position = 'absolute' // 相对viewer

    let left = parseInt(coordinates.rectLeft)
    let top = parseInt(coordinates.rectTop)
    let marginTop = parseInt(getStyle(this.pageNode, 'marginTop'))
    let marginLeft = parseInt(getStyle(this.pageNode, 'marginLeft'))
    tableContainer.style.left = left - marginLeft - 9 + 'px'
    tableContainer.style.top = top - marginTop - 9 + 'px'
    this.canvasNode.appendChild(tableContainer)

    const warp = document.createElement('div')
    warp.setAttribute('class', 'draw-table-warp')
    warp.style.border = '1px solid rgb(0, 0, 255)'
    warp.style.height = tableContainer.clientHeight + 'px';
    warp.style.width = tableContainer.clientWidth + 'px';
    tableContainer.appendChild(warp)

    const table = document.createElement('table')
    table.setAttribute('class', 'draw-warp')
    table.setAttribute('border', '0')
    table.setAttribute('id', 'parentWarp')
    table.style.borderCollapse = 'collapse'
    table.style.height = warp.clientHeight + 'px'
    table.style.width = warp.clientWidth + 'px'
    warp.appendChild(table)
  }

  get selector() {
    return `page${this.pageNode.dataset('pageNumber')}Table`
  }
}

DomTable.prototype.viewerContainerID = 'viewerContainer'

class DrawSession {
  constructor(context) {
    this.context = context
    this.startX = 0
    this.startY = 0
    this.rectTop = 0
    this.rectLeft = 0
    this.rectHeight = 0
    this.rectWidth = 0
  }

  reset() {
    this.startX = 0
    this.startY = 0
    this.rectTop = 0
    this.rectLeft = 0
    this.rectHeight = 0
    this.rectWidth = 0
  }

  updateStartProps(evt) {
    let startX = evt.clientX + this.context.scrollLeft
    let startY = evt.clientY + this.context.scrollTop
    this.startX = startX
    this.startY = startY
  }

  updateRectProps(evt) {
    let scrollTop = this.context.scrollTop
    let scrollLeft = this.context.scrollLeft
    this.rectLeft = this.startX - evt.clientX - scrollLeft > 0 ? evt.clientX + scrollLeft : this.startX
    this.rectTop = this.startY - evt.clientY - scrollTop > 0 ? evt.clientY + scrollTop : this.startY
    this.rectHeight = Math.abs(this.startY - evt.clientY - scrollTop)
    this.rectWidth = Math.abs(this.startX - evt.clientX - scrollLeft)
  }
}

export default class TablePlugin {
  constructor() {
    this.tableSelectors = []
    this.drawFlag = false
    this.pageNode = null
    this.firstChildNode = null
    this.eventHandlers = {}
    this.context = document.getElementById('viewerContainer')
    this.drawSession = new DrawSession(this.context)
  }

  resetDrawSession() {
    this.drawSession.reset()
  }

  register() {
    console.log('resister', this.name)
    this.bindWindowEvents()
  }

  deregister() {
    console.log('deresister', this.name)
    this.unbindWindowEvents()
  }

  addEventListener(eventName, method) {
    let handler = method.bind(this)
    this.eventHandlers[eventName] = handler
    this.context.addEventListener(eventName, handler)
  }

  removeEventListener(eventName) {
    let handler = this.eventHandlers[eventName]
    this.context.removeEventListener(eventName, handler)
  }

  bindWindowEvents() {
    console.log('bindWindowEvents')
    this.addEventListener('mousedown', this.mouseDownListener)
    this.addEventListener('mousemove', this.mouseMoveListener)
    this.addEventListener('mouseup', this.mouseUpListener)
  }

  unbindWindowEvents() {
    console.log('unbindWindowEvents')
    this.removeEventListener('mousedown')
    this.removeEventListener('mousemove')
    this.removeEventListener('mouseup')
  }

  static createTempDiv(startX, startY) {
    let div = document.createElement('div')
    div.id = 'selected'
    div.className = 'dashed-table'
    div.style.left = startX + 'px'
    div.style.top = startY + 'px'

    return div
  }

  mouseDownListener(e) {
    if (isCurPage(e)) {
      return
    }

    this.pageNode = findPageNode(e.target)
    this.firstChildNode = this.pageNode.childNodes[0]
    if (this.pageNode === null) {
      return
    }

    let evt = window.event || e
    this.drawSession.updateStartProps(evt)
    this.context.appendChild(TablePlugin.createTempDiv(this.drawSession.startX, this.drawSession.startY))
    this.drawFlag = true
  }

  mouseMoveListener(e) {
    console.log('mouseMoveListener')
    if (!this.drawFlag) {
      return
    }

    let evt = window.event || e
    this.drawSession.updateRectProps(evt)
    const node = document.getElementById('selected')
    node.style.left = this.drawSession.rectLeft + 'px'
    node.style.top = this.drawSession.rectTop + 'px'
    node.style.width = this.drawSession.rectWidth + 'px'
    node.style.height = this.drawSession.rectHeight + 'px'
  }

  mouseUpListener() {
    if (!this.drawFlag) {
      return
    }
    this.drawFlag = false
    let node = document.getElementById('selected')
    node.parentNode.removeChild(node)
    if (!judgePageSize(node) || !this.firstChildNode) {
      return
    }

    let domTable = new DomTable(this.pageNode)
    let dateNow = Date.parse(new Date())
    let selector = `table_border${dateNow}`
    domTable.paint(this.drawSession, selector)
    this.tableSelectors.push(selector)
    this.resetDrawSession()
  }
}

TablePlugin.prototype.name = 'table'
