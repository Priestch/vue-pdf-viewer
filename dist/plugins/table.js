export default class TablePlugin {
  constructor() {
    this.tables = []
    this.drawFlag = false
    this.pageNode = null
    this.firstChildNode = null
    this.eventHandlers = {}
    this.drawSession = {}
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
    document.addEventListener(eventName, handler)
  }

  removeEventListener(eventName) {
    let handler = this.eventHandlers[eventName]
    document.removeEventListener(eventName, handler)
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
    this.removeEventListener('mouseup')
  }

  drawTable() {
    console.log('drawTable')
    // draw table logic
  }

  mouseDownListener(e) {
    console.log('mouseDownListener')
    // custom event listener
  }

  mouseMoveListener(e) {
    console.log('mouseMoveListener')
    // custom event listener
  }

  mouseUpListener(e) {
    console.log('mouseUpListener')
    // custom event listener
  }
}

TablePlugin.prototype.name = 'table'
