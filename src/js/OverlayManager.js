import PrimaryOverlay from "./overlayElements/PrimaryOverlay"
import ControlsInfoOverlay from "./overlayElements/ControlsInfoOverlay"
import LevelCompleteOverlay from "./overlayElements/LevelCompleteOverlay"
import LevelStartOverlay from "./overlayElements/LevelStartOverlay"
import YouDiedOverlay from "./overlayElements/YouDiedOverlay"
import DarkRoomOverlay from "./overlayElements/DarkRoomOverlay"
import ExitInstructionsOverlay from "./overlayElements/ExitInstructionsOverlay"
import RoomMessageOverlay from "./overlayElements/RoomMessageOverlay"
import BossBarOverlay from "./overlayElements/BossBarOverlay"

class OverlayManager {
  constructor(){
    this.activeOverlayElements = []
  }

  renderOverlays(){
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

  addExitInstructionsOverlay() {
    if(activeRoom.x != 0 || activeRoom.y != 0) return
    this.activeOverlayElements.push(new ExitInstructionsOverlay())
  }

  addYouDiedOverlay() {
    if(this.activeOverlayElements.find(overlay => overlay.name == "You Died Overlay")) return
    this.activeOverlayElements.push(new YouDiedOverlay())
  }

  addDarkRoomOverlay() {
    if(this.activeOverlayElements.find(overlay => overlay.name == "Dark Room Overlay")) return
    this.activeOverlayElements.push(new DarkRoomOverlay())
  }

  addRoomMessageOverlay() {
    this.activeOverlayElements.push(new RoomMessageOverlay())
  }

  addBossBarOverlay() {
    if(this.activeOverlayElements.find(overlay => overlay.name == "Boss Bar Overlay")) return
    this.activeOverlayElements.push(new BossBarOverlay())
  }
}

export default OverlayManager