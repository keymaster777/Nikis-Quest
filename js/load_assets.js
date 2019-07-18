var imagesOK=0;
var totalURLS=0;
var floorURLS=[];
var wallURLS=[];
var floorimgs=[];
var wallimgs=[];

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

//src for floor images
floorURLS.push('img/sprites/floor_1.png');
floorURLS.push('img/sprites/floor_2.png');
floorURLS.push('img/sprites/floor_3.png');
floorURLS.push('img/sprites/floor_4.png');
floorURLS.push('img/sprites/floor_5.png');
floorURLS.push('img/sprites/floor_7.png');


function startLoadingAllImages(callback){
    loadImgArray(floorURLS, floorimgs, callback);
    loadImgArray(wallURLS, wallimgs, callback);
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