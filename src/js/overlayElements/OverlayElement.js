class OverlayElement {
  constructor(x,y, name, renderPriority){
    this.x = x
    this.y = y
    this.name = name
    this.renderPriority = renderPriority
    this.buttonBoxes = []

    this.beforeElementSetup()
  }

  beforeElementSetup(){
    console.log(`Setting up ${this.name}.`)
  }

  tearDownConditions(){
    return false
  }

  render(){
    if(this.tearDownConditions()) this.elementTeardown()
  }

  elementTeardown(){
    overlayManager.activeOverlayElements = overlayManager.activeOverlayElements.filter(overlay => overlay !== this)
    console.log(`Tearing down ${this.name}.`)
  }
}

export default OverlayElement