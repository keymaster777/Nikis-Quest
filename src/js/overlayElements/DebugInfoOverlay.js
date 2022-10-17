import OverlayElement from "./OverlayElement"
import { CANVAS_WIDTH, CANVAS_HEIGHT } from "../constants"

class DebugInfoOverlay extends OverlayElement{
  constructor(){
    super(220, 0, "Debug Info Overlay", 1)
    this.width = CANVAS_WIDTH-440
    this.height = CANVAS_HEIGHT

    this.fpsTarget = 60
    this.fpsLastCalled = performance.now()
    this.fpsLastShown = performance.now()

    this.avgFps, this.highFps, this.lowFps, this.medianFps, this.modeFps

    this.lowestMedian = 999
    this.lowestMode = 999
    this.lowestAvg = 999

    this.fpsBuffer = []
  }

  updateDebugInfo(){
    let now = performance.now()
    let delta = (now - this.fpsLastCalled) / 1000
    this.fpsLastCalled = now
    this.fpsBuffer.push(~~(1 / delta))

    if (now - this.fpsLastShown > 1000) {
      this.fpsLastShown = now
      this.highFps = Math.max(...this.fpsBuffer)
      this.lowFps = Math.min(...this.fpsBuffer)

      this.avgFps = this.fpsBuffer.reduce((a, b) => a + b, 0) / this.fpsBuffer.length
      this.medianFps = this.fpsBuffer.sort()[Math.ceil(this.fpsBuffer.length / 2)]
      this.modeFps = this.calculateModeFps(this.fpsBuffer)

      if (now - this.timer > 3000) {
        if (this.medianFps < this.lowestMedian) this.lowestMedian = this.medianFps
        if (this.modeFps < this.lowestMode) this.lowestMode = this.modeFps
        if (~~this.avgFps < this.lowestAvg) this.lowestAvg = ~~this.avgFps
      }

      this.fpsBuffer = []
    }
  }

  calculateModeFps(fpsArray) {
    let totaled = []
    fpsArray.forEach(fps => {
      let targetFps = totaled.find(ele => ele[0] === fps)
      if (targetFps) targetFps[1] += 1
      if (targetFps === undefined) totaled.push([fps, 1])
    })
    let sortedTotals = totaled.sort((a, b) => b[1] - a[1])
    return sortedTotals[0][0]
  }

  beforeElementSetup(){
    this.timer = performance.now()
    if(!window.confirm("Showing debug info will also reduce fps as it is somewhat system intensive, do you understand?")) {
      localStorage.setItem("showDebug", "0")
    }
  }

  tearDownConditions(){
    return localStorage.getItem("showDebug") === "0"
  }

  elementTeardown(){
    super.elementTeardown()
  }

  setDebugColorFor(field){
    ctx.fillStyle = "white"

    if (field < this.fpsTarget * .9) ctx.fillStyle = "orange"
    if (field < this.fpsTarget * .75) ctx.fillStyle = "red"
  }

  render(){
    this.updateDebugInfo()

    ctx.translate(this.x, this.y)
    ctx.globalAlpha = 0.5
    ctx.textAlign = "right"
    ctx.fillStyle = "white"
    ctx.font = "24px bitPotionFont"

    ctx.fillText(`Static Entites: ${activeRoom.tileArray.length}`, this.width, this.height - 150)
    ctx.fillText(`Dynamic Entites: ${activeRoom.allEntities().length}`, this.width, this.height - 135)

    this.setDebugColorFor(this.lowestMedian)
    ctx.fillText(`Lowest Fps Median: ${this.lowestMedian}`, this.width, this.height - 110)
    this.setDebugColorFor(this.lowestMode)
    ctx.fillText(`Lowest Fps Mode: ${this.lowestMode}`, this.width, this.height - 95)
    this.setDebugColorFor(this.lowestAvg)
    ctx.fillText(`Lowest Fps Avg: ${this.lowestAvg}`, this.width, this.height - 80)

    ctx.fillStyle = "white"
    ctx.fillText(`hi/lo: ${this.highFps}/${this.lowFps}`, this.width, this.height - 55)

    this.setDebugColorFor(this.medianFps)
    ctx.fillText(`Median Fps: ${this.medianFps}`, this.width, this.height - 40)
    this.setDebugColorFor(this.modeFps)
    ctx.fillText(`Mode Fps: ${this.modeFps}`, this.width, this.height - 25)
    this.setDebugColorFor(this.avgFps)
    ctx.fillText(`Avg fps: ${Math.min(~~this.avgFps, this.fpsTarget)}`, this.width, this.height - 10)
    super.render()
  }
}

export default DebugInfoOverlay