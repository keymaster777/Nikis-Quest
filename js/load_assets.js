var imagesOK=0;
var totalURLS=0;
var floorURLS=[];
var wallURLS=[];
var itemURLS=[];
var floorimgs=[];
var wallimgs=[];
var itemimgs=[];

//src for wall images
wallURLS.push('img/sprites/wall_side_mid_left.png');
wallURLS.push('img/sprites/wall_side_mid_right.png');
wallURLS.push('img/sprites/wall_mid.png');
wallURLS.push('img/sprites/wall_inner_corner_l_top_left.png');
wallURLS.push('img/sprites/wall_inner_corner_l_top_rigth.png');
wallURLS.push('img/sprites/wall_top_right.png');
wallURLS.push('img/sprites/wall_top_left.png');
wallURLS.push('img/sprites/wall_top_mid.png');
wallURLS.push('img/sprites/wall_corner_left.png');
wallURLS.push('img/sprites/wall_corner_right.png');
wallURLS.push('img/sprites/wall_hole_1.png');
wallURLS.push('img/sprites/wall_banner_red.png');
wallURLS.push('img/sprites/wall_hole_2.png');
wallURLS.push('img/sprites/wall_banner_yellow.png');
wallURLS.push('img/sprites/wall_goo.png');
wallURLS.push('img/sprites/wall_arch.png');


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