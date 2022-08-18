// UI Image Imports
import HeartImage from '../img/UIelements/Sprite_heart.png'
import LeftArrowImg from '../img/UIelements/ARROWLEFT.png'
import RightArrowImg from '../img/UIelements/ARROWRIGHT.png'
import UpArrowImg from '../img/UIelements/ARROWUP.png'
import DownArrowImg from '../img/UIelements/ARROWDOWN.png'
import LetterAImg from '../img/UIelements/A.png'
import LetterWImg from '../img/UIelements/W.png'
import LetterSImg from '../img/UIelements/S.png'
import LetterDImg from '../img/UIelements/D.png'
import SpaceBarImg from '../img/UIelements/SPACE.png'

// Player Image Imports
import RunRightSprite from "../img/player/run-right.png"
import RunLeftSprite from "../img/player/run-left.png"
import RunUpSprite from "../img/player/run-up.png"
import RunDownSprite from "../img/player/run-down.png"
import IdleLeftImg from "../img/player/idle-left.png"
import IdleRightImg from "../img/player/idle-right.png"
import IdleDownImg from "../img/player/idle-down.png"
import IdleUpImg from "../img/player/idle-up.png"

// Monster Image Imports
import GnollShamanWalkLeftSprite from '../img/Mobs/GnollShaman_Walk_Left.png'
import GnollShamanWalkRightSprite from '../img/Mobs/GnollShaman_Walk_Right.png'

// Weapon Image Imports
import KatanaImg from "../img/sprites/weapon_katana.png"

// Tile Image Imports
import ChestImg from "../img/2D Pixel Dungeon Asset Pack/items and trap_animation/box_2/box_2_1.png"
import PotionImg from '../img/2D Pixel Dungeon Asset Pack/items and trap_animation/flasks/flasks_1_1.png'

import Floor1Img from "../img/sprites/floor_1.png"
import Floor2Img from "../img/sprites/floor_2.png"
import Floor3Img from "../img/sprites/floor_3.png"
import Floor4Img from "../img/sprites/floor_4.png"
import Floor5Img from "../img/sprites/floor_5.png"
import Floor7Img from "../img/sprites/floor_7.png"
import EdgeImage from "../img/sprites/edge.png"

import WallArchImg from "../img/sprites/wall_arch.png"
import WallSideFrontLeftImg from "../img/sprites/wall_side_front_left.png"
import WallSideFrontRightImg from "../img/sprites/wall_side_front_right.png"
import WallSideTopLeftImg from "../img/sprites/wall_side_top_left.png"
import WallSideTopRightImg from "../img/sprites/wall_side_top_right.png"
import WallSideMidRightImg from "../img/sprites/wall_side_mid_right.png"
import WallMidImg from '../img/sprites/wall_mid.png'
import WallMidTopImg from '../img/sprites/wall_top_mid.png'
import WallSideMidLeftImg from '../img/sprites/wall_side_mid_left.png';       
import WallTopLeftImg from "../img/sprites/wall_top_left.png" 
import WallTopRightImg from "../img/sprites/wall_top_right.png" 
import WallLeftImg from "../img/sprites/wall_left.png"
import WallRightImg from "../img/sprites/wall_right.png"
import WallInnerCornerTopLeftImg from '../img/sprites/wall_inner_corner_l_top_left.png'
import WallInnerCornerTopRightImg from '../img/sprites/wall_inner_corner_l_top_rigth.png'
import WallHole1Img from '../img/sprites/wall_hole_1.png'
import WallBannerRedImg from '../img/sprites/wall_banner_red.png'
import WallHole2Img from '../img/sprites/wall_hole_2.png'
import WallBannerYellowImg from '../img/sprites/wall_banner_yellow.png'
import WallGooImg from '../img/sprites/wall_goo.png'
import WallColumnTopImg from '../img/sprites/wall_column_top.png'
import WallColumnMidImg from '../img/sprites/wall_column_mid.png'
import WallColumnBaseImg from '../img/sprites/wall_column_base.png'

import ColumnBaseImg from '../img/sprites/column_base.png'
import ColumnMidImg from '../img/sprites/column_mid.png'
import ColumnTopImg from '../img/sprites/column_top.png'

import TorchSprite from '../img/sprites/torch.png'
import TorchSideLeftSprite from '../img/sprites/torch-side-left.png'
import TorchSideRightSprite from '../img/sprites/torch-side-right.png'

function setUpImages() {
  let imgs = {}

  // UI Images and Sprites
  imgs.heart = new Image()
  imgs.heart.src = HeartImage
  imgs.letterA = new Image()
  imgs.letterA.src = LetterAImg
  imgs.letterW = new Image()
  imgs.letterW.src = LetterWImg
  imgs.letterS = new Image()
  imgs.letterS.src = LetterSImg
  imgs.letterD = new Image()
  imgs.letterD.src = LetterDImg
  imgs.leftArrow = new Image()
  imgs.leftArrow.src = LeftArrowImg
  imgs.rightArrow = new Image()
  imgs.rightArrow.src = RightArrowImg
  imgs.upArrow = new Image()
  imgs.upArrow.src = UpArrowImg
  imgs.downArrow = new Image()
  imgs.downArrow.src = DownArrowImg
  imgs.spaceBar = new Image()
  imgs.spaceBar.src = SpaceBarImg

  // Player Images and Sprites
  imgs.runRight = new Image()
  imgs.runRight.src = RunRightSprite
  imgs.runLeft = new Image()
  imgs.runLeft.src = RunLeftSprite
  imgs.runUp = new Image()
  imgs.runUp.src = RunUpSprite
  imgs.runDown = new Image()
  imgs.runDown.src = RunDownSprite
  imgs.idleLeft = new Image()
  imgs.idleLeft.src = IdleLeftImg
  imgs.idleRight = new Image()
  imgs.idleRight.src = IdleRightImg
  imgs.idleUp = new Image()
  imgs.idleUp.src = IdleUpImg
  imgs.idleDown = new Image()
  imgs.idleDown.src = IdleDownImg

  // Monster Images and Sprites
  imgs.gnollShamanWalkLeft = new Image()
  imgs.gnollShamanWalkLeft.src = GnollShamanWalkLeftSprite
  imgs.gnollShamanWalkRight = new Image()
  imgs.gnollShamanWalkRight.src = GnollShamanWalkRightSprite

  // Weapon Images and Sprites
  imgs.katana = new Image()
  imgs.katana.src = KatanaImg

  // Tile Images and Sprites
  imgs.chest = new Image()
  imgs.chest.src = ChestImg
  imgs.potion = new Image()
  imgs.potion.src = PotionImg

  imgs.floor1 = new Image()
  imgs.floor1.src = Floor1Img
  imgs.floor2 = new Image()
  imgs.floor2.src = Floor2Img
  imgs.floor3 = new Image()
  imgs.floor3.src = Floor3Img
  imgs.floor4 = new Image()
  imgs.floor4.src = Floor4Img
  imgs.floor5 = new Image()
  imgs.floor5.src = Floor5Img
  imgs.floor7 = new Image()
  imgs.floor7.src = Floor7Img
  imgs.edge = new Image()
  imgs.edge.src = EdgeImage

  imgs.wallArch = new Image()
  imgs.wallArch.src = WallArchImg
  imgs.wallSideFrontLeft = new Image()
  imgs.wallSideFrontLeft.src = WallSideFrontLeftImg
  imgs.wallSideFrontRight = new Image()
  imgs.wallSideFrontRight.src = WallSideFrontRightImg
  imgs.wallSideTopLeft = new Image()
  imgs.wallSideTopLeft.src = WallSideTopLeftImg
  imgs.wallSideTopRight = new Image()
  imgs.wallSideTopRight.src = WallSideTopRightImg
  imgs.wallSideMidRight = new Image()
  imgs.wallSideMidRight.src = WallSideMidRightImg
  imgs.wallSideMidLeft = new Image()
  imgs.wallSideMidLeft.src = WallSideMidLeftImg
  imgs.wallMid = new Image()
  imgs.wallMid.src = WallMidImg
  imgs.wallMidTop = new Image()
  imgs.wallMidTop.src = WallMidTopImg
  imgs.wallTopLeft = new Image()
  imgs.wallTopLeft.src = WallTopLeftImg
  imgs.wallTopRight = new Image()
  imgs.wallTopRight.src = WallTopRightImg
  imgs.wallLeft = new Image()
  imgs.wallLeft.src = WallLeftImg
  imgs.wallRight = new Image()
  imgs.wallRight.src = WallRightImg
  imgs.wallInnerCornerTopLeft = new Image()
  imgs.wallInnerCornerTopLeft.src = WallInnerCornerTopLeftImg
  imgs.wallInnerCornerTopRight = new Image()
  imgs.wallInnerCornerTopRight.src = WallInnerCornerTopRightImg
  imgs.wallHole = new Image()
  imgs.wallHole.src = WallHole1Img
  imgs.wallHoleTwo = new Image()
  imgs.wallHoleTwo.src = WallHole2Img
  imgs.wallBannerRed = new Image()
  imgs.wallBannerRed.src = WallBannerRedImg
  imgs.wallBannerYellow = new Image()
  imgs.wallBannerYellow.src = WallBannerYellowImg
  imgs.wallGoo = new Image()
  imgs.wallGoo.src = WallGooImg
  imgs.wallColumnBase = new Image()
  imgs.wallColumnBase.src = WallColumnBaseImg
  imgs.wallColumnMid = new Image()
  imgs.wallColumnMid.src = WallColumnMidImg
  imgs.wallColumnTop = new Image()
  imgs.wallColumnTop.src = WallColumnTopImg

  imgs.columnBase = new Image()
  imgs.columnBase.src = ColumnBaseImg
  imgs.columnMid = new Image()
  imgs.columnMid.src = ColumnMidImg
  imgs.columnTop = new Image()
  imgs.columnTop.src = ColumnTopImg

  imgs.torch = new Image()
  imgs.torch.src = TorchSprite
  imgs.torchSideLeft = new Image()
  imgs.torchSideLeft.src = TorchSideLeftSprite
  imgs.torchSideRight = new Image()
  imgs.torchSideRight.src = TorchSideRightSprite

  global.imgs = imgs
}
export {setUpImages}