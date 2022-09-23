import PrimaryOverlay from "./overlayElements/PrimaryOverlay"
import ControlsInfoOverlay from "./overlayElements/ControlsInfoOverlay"
import LevelCompleteOverlay from "./overlayElements/LevelCompleteOverlay"
import LevelStartOverlay from "./overlayElements/LevelStartOverlay"
import YouDiedOverlay from "./overlayElements/YouDiedOverlay"
import DarkRoomOverlay from "./overlayElements/DarkRoomOverlay"

class OverlayManager {
  constructor(){
    this.activeOverlayElements = []
  }

  renderLayovers(){
    let elements = this.activeOverlayElements.sort((b,a) => a.renderPriority - b.renderPriority)
    elements.forEach(overlay => {
      ctx.save()
      overlay.render()
      ctx.restore()
    })
  }

  addPrimaryOverlay() {
    this.activeOverlayElements.push(new PrimaryOverlay())
  }

  addControlsInfoOverlay() {
    this.activeOverlayElements.push(new ControlsInfoOverlay())
  }

  addLevelCompleteOverlay() {
    if(this.activeOverlayElements.find(overlay => overlay.name == "Level Complete Overlay")) return
    this.activeOverlayElements.push(new LevelCompleteOverlay())
  }

  addLevelStartOverlay() {
    this.activeOverlayElements.push(new LevelStartOverlay())
  }

  addYouDiedOverlay() {
    if(this.activeOverlayElements.find(overlay => overlay.name == "You Died Overlay")) return
    this.activeOverlayElements.push(new YouDiedOverlay())
  }

  addDarkRoomOverlay() {
    if(this.activeOverlayElements.find(overlay => overlay.name == "Dark Room Overlay")) return
    this.activeOverlayElements.push(new DarkRoomOverlay())
  }

}

export default OverlayManager