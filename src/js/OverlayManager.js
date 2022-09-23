import PrimaryOverlay from "./overlayElements/PrimaryOverlay"
import ControlsInfoOverlay from "./overlayElements/ControlsInfoOverlay"
import LevelCompleteOverlay from "./overlayElements/LevelCompleteOverlay"
import LevelStartOverlay from "./overlayElements/LevelStartOverlay"
import YouDiedOverlay from "./overlayElements/YouDiedOverlay"

class OverlayManager {
  constructor(){
    this.activeOverlayElements = []
  }

  renderLayovers(){
    this.activeOverlayElements.forEach(overlay => {
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

}

export default OverlayManager