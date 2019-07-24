var imagesOK=0;
var totalURLS=0;
var floorURLS=[];
var wallURLS=[];
var itemURLS=[];
var floorimgs=[];
var wallimgs=[];
var itemimgs=[];

//src for wall images
wallURLS.push('img/sprites/wall_side_mid_left.png');                //0
wallURLS.push('img/sprites/wall_side_mid_right.png');               //1
wallURLS.push('img/sprites/wall_mid.png');                          //2
wallURLS.push('img/sprites/wall_inner_corner_l_top_left.png');      //3
wallURLS.push('img/sprites/wall_inner_corner_l_top_rigth.png');     //4
wallURLS.push('img/sprites/wall_top_right.png');                    //5
wallURLS.push('img/sprites/wall_top_left.png');                     //6
wallURLS.push('img/sprites/wall_top_mid.png');                      //7
wallURLS.push('img/sprites/wall_corner_left.png');                  //8
wallURLS.push('img/sprites/wall_corner_right.png');                 //9
wallURLS.push('img/sprites/wall_hole_1.png');                       //10
wallURLS.push('img/sprites/wall_banner_red.png');                   //11
wallURLS.push('img/sprites/wall_hole_2.png');                       //12
wallURLS.push('img/sprites/wall_banner_yellow.png');                //13
wallURLS.push('img/sprites/wall_goo.png');                          //14
wallURLS.push('img/sprites/wall_arch.png');                         //15
wallURLS.push('img/sprites/wall_side_front_left.png');              //16
wallURLS.push('img/sprites/wall_side_front_right.png');             //17
wallURLS.push('img/sprites/wall_side_top_left.png');                //18
wallURLS.push('img/sprites/wall_side_top_right.png');               //19
wallURLS.push('img/sprites/wall_left.png');                         //20
wallURLS.push('img/sprites/wall_right.png');                        //21


//src for floor images
floorURLS.push('img/sprites/floor_1.png');
floorURLS.push('img/sprites/floor_2.png');
floorURLS.push('img/sprites/floor_3.png');
floorURLS.push('img/sprites/floor_4.png');
floorURLS.push('img/sprites/floor_5.png');
floorURLS.push('img/sprites/floor_7.png');

//src for item images
itemURLS.push('img/2D Pixel Dungeon Asset Pack/items and trap_animation/box_2/box_2_1.png');
itemURLS.push('img/2D Pixel Dungeon Asset Pack/items and trap_animation/flasks/flasks_1_1.png');


function startLoadingAllImages(callback){
    loadImgArray(floorURLS, floorimgs, callback);
    loadImgArray(wallURLS, wallimgs, callback);
    loadImgArray(itemURLS, itemimgs, callback);
}
//neatly packages an array of images using an array of urls, callback checks if all image arrays are loaded
function loadImgArray(urls, destination, callback){
    totalURLS+=urls.length;
    for (var i=0; i<urls.length; i++) {
        var img = new Image();
        destination.push(img);
        img.onload = function(){ 
          imagesOK++; 
          if(imagesOK>=totalURLS){
            callback();
            }
        };
        img.onerror=function(){alert("image load failed");} 
        img.src = urls[i];
      }
}  