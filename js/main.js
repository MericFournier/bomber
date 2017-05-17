
var game = {};
game.data = {}; 
game.data.numBlock                           = 300;
game.data.width                              = 33; // profondeur de ligne 
game.data.height                             = 23; // lignes 
game.data.increment                          = 30; // taille bloc
game.data.bombDelay                          = 2000; // délai explosion bombe
// gestion des éléments 
game.elements                                = {}; 
game.elements.area                           = {}
game.elements.area.case                      = [];
game.elements.area.briques                   = [];
game.elements.area.container                 = document.querySelector('.game');
game.elements.area.setVirtuel                = function() {
   for ( var i =0; i<game.data.height; i++) {
      var array = []; 
      game.elements.area.case.push(array);
   }
}
game.elements.area.init                      = function() {
   game.elements.area.container.style.width = (game.data.width*game.data.increment)+"px";
   game.elements.area.setVirtuel();
   var inc = 0; 
   for ( var i = 0; i<game.data.height; i++)
   {
      for ( var j = 0; j<game.data.width; j++)
      {
         inc++; 
         var gameCase = document.createElement('div');
         gameCase.classList.add('case');
         gameCase.style.width = game.data.increment+'px';
         gameCase.style.height = game.data.increment+'px'; 
         gameCase.setAttribute('data-id',inc);
         gameCase.setAttribute('bombed',0);
         gameCase.setAttribute('type','0');
         game.elements.area.case[i].push(gameCase);

         // création des murs 'indestructibles' de base
         if ( i%2 != 0 && j%2 != 0 ){
            gameCase.style.background ='black';
            gameCase.setAttribute('type','2');
            var data = {}
            data.i = i;
            data.j = j;
            game.elements.area.briques.push(data);
         }

         game.elements.area.container.appendChild(gameCase); 
      }   
   }
}
game.elements.area.wall                      = function () {
   for ( var i =0; i<game.elements.area.case.length; i++) {
      for ( var j =0; j<game.elements.area.case[i].length; j++) {
         if ( i%2 != 0 && j%2 == 0 ) {
            //console.log(game.elements.area.case[i][j]);
            game.elements.area.case[i][j].style.backgroundColor = '#C4A6A6';
            game.elements.area.case[i][j].setAttribute('type',1);
         }
         if ( i%2 == 0 && j%2 != 0 ) {
            //console.log(game.elements.area.case[i][j]);
            game.elements.area.case[i][j].style.backgroundColor = '#C4A6A6';
            game.elements.area.case[i][j].setAttribute('type',1);
         }
         game.elements.area.case[0][1].style.backgroundColor = 'white';
         game.elements.area.case[0][1].setAttribute('type',0);
         game.elements.area.case[1][0].style.backgroundColor = 'white';
         game.elements.area.case[1][0].setAttribute('type',0);


      }  
   }
}
// gestion personnage 
game.perso = {}; 
game.perso.object                            = document.createElement('div');
game.perso.object.classList.add('perso');
game.perso.object.style.width                = game.data.increment+'px';
game.perso.object.style.height               = game.data.increment+'px';
game.perso.top                               = 0;
game.perso.left                              = 0;
game.perso.pos                               = {x:game.perso.top, y:game.perso.left};
game.perso.methods                           = {};
game.perso.methods.init                      = function() {
   game.elements.area.container.append(game.perso.object);
   game.perso.top = 0;
   game.perso.left = 0;
   game.perso.methods.position(game.perso.top,game.perso.left);
}
game.perso.die = function(){
   //console.log('dead');
   game.perso.top = 0;
   game.perso.left = 0;
   game.perso.methods.position(game.perso.top,game.perso.left);
   
}
game.perso.methods.position                  = function(top,left) {
   top = top*game.data.increment;
   left = left*game.data.increment;
   //console.log(game.perso.top +' '+game.perso.left);
   game.perso.object.style.top = top+"px";
   game.perso.object.style.left = left+"px";
   game.perso.object.style.background = 'black';
   game.perso.pos = {x:game.perso.top, y:game.perso.left};
}
game.perso.methods.deplace                   = function() {
   document.onkeydown = function(event) {
      if ( event.keyCode == 37) {
         if ( game.perso.left == 0) {
            return false;
         }
         game.perso.left -= 1;
         game.perso.top = game.perso.top;
         var type = game.elements.area.case[game.perso.top][game.perso.left].getAttribute('type');
         if ( type > 0) {
            game.perso.left += 1;
            return false;
         }
         game.perso.methods.position(game.perso.top,game.perso.left);
         if ( game.elements.area.case[game.perso.top][game.perso.left].getAttribute('bombed') == 1 ) {
            game.perso.die();
         }
      }
      else if ( event.keyCode == 38 ){
         if ( game.perso.top == 0) {
            return false;
         }
         game.perso.left = game.perso.left;
         game.perso.top -= 1;
         var type = game.elements.area.case[game.perso.top][game.perso.left].getAttribute('type');
         if ( type > 0) {
            game.perso.top += 1;
            return false;
         }
         game.perso.methods.position(game.perso.top,game.perso.left);
         if ( game.elements.area.case[game.perso.top][game.perso.left].getAttribute('bombed') == 1 ) {
            game.perso.die();
         }

      }
      else if ( event.keyCode == 39 ){
         if ( game.perso.left == (game.data.width - 1)) {
            return false;
         }
         game.perso.left += 1;
         game.perso.top = game.perso.top;
         var type = game.elements.area.case[game.perso.top][game.perso.left].getAttribute('type');
         if ( type > 0) {
            game.perso.left -= 1;
            return false;
         }
         game.perso.methods.position(game.perso.top,game.perso.left);
         if ( game.elements.area.case[game.perso.top][game.perso.left].getAttribute('bombed') == 1 ) {
            game.perso.die();
         }
      }
      else if ( event.keyCode == 40 ){
         if ( game.perso.top == (game.data.height - 1)) {
            return false;
         }
         game.perso.left = game.perso.left;
         game.perso.top += 1;
         var type = game.elements.area.case[game.perso.top][game.perso.left].getAttribute('type');
         if ( type > 0) {
            game.perso.top -= 1;
            return false;
         }
         game.perso.methods.position(game.perso.top,game.perso.left);
         if ( game.elements.area.case[game.perso.top][game.perso.left].getAttribute('bombed') == 1 ) {
            game.perso.die();
         }
      }
      else if ( event.keyCode == 32 ){
         //console.log('bomb');
         game.bomb.methods.setBomb();
      }
      else {
         return false;
      }
   }
}
// gestion bombes 
game.bomb                                    = {};
game.bomb.isSet                              = false;
game.bomb.methods                            = {};
game.bomb.object                             = document.createElement('div');
game.bomb.object.classList.add('bomb_item'); 
game.bomb.object.style.width                 = game.data.increment+'px';
game.bomb.object.style.height                = game.data.increment+'px';
//console.log(game.bomb.object);

game.bomb.methods.setBomb                    = function() {

   var selectDiv = {x:game.perso.top,y:game.perso.left};
   var touched = [];
   var virtuals = []; 
   game.elements.area.case[selectDiv.x][selectDiv.y].style.backgroundColor = 'yellow';
   touched.push(game.elements.area.case[selectDiv.x][selectDiv.y]);
   if ( game.elements.area.case[selectDiv.x-1] ) {
      if ( game.elements.area.case[selectDiv.x-1][selectDiv.y]) {
         //console.log('haut');
         if ( game.elements.area.case[selectDiv.x-1][selectDiv.y].getAttribute('type')<2 ) {
            touched.push(game.elements.area.case[selectDiv.x-1][selectDiv.y]);
            virtuals.push({x:selectDiv.x-1, y:selectDiv.y}); 
         }
      }
   }
   if ( game.elements.area.case[selectDiv.x+1] ) {
      if ( game.elements.area.case[selectDiv.x+1][selectDiv.y]) {
         //console.log('bas');
         if ( game.elements.area.case[selectDiv.x+1][selectDiv.y].getAttribute('type')<2 ) {
            touched.push(game.elements.area.case[selectDiv.x+1][selectDiv.y]);
            virtuals.push({x:selectDiv.x+1, y:selectDiv.y});
         }
      }
   }
   if ( game.elements.area.case[selectDiv.x][selectDiv.y+1]) {
      //console.log('droite');
      if ( game.elements.area.case[selectDiv.x][selectDiv.y+1].getAttribute('type')<2 ) {
         touched.push(game.elements.area.case[selectDiv.x][selectDiv.y+1]);
         virtuals.push({x:selectDiv.x, y:selectDiv.y+1});
      }
   }
   if ( game.elements.area.case[selectDiv.x][selectDiv.y-1]) {
      //console.log('gauche');
      if ( game.elements.area.case[selectDiv.x][selectDiv.y-1].getAttribute('type')<2 ) {
         touched.push( game.elements.area.case[selectDiv.x][selectDiv.y-1]);
         virtuals.push({x:selectDiv.x, y:selectDiv.y-1});
      }
   }
   //console.log(virtuals);
   setTimeout(function(){ 
      for ( var i = 0 ; i<touched.length; i++) {
         //console.log(touched[i]);
         touched[i].classList.add('bombed');
         touched[i].setAttribute('bombed',1);
         if ( touched[i].getAttribute('type') == 1) {
            touched[i].setAttribute('type',0);
            touched[i].style.backgroundColor = 'white';
         }
      }
      for ( var i = 0; i<virtuals.length; i++) {
         if ( virtuals[i].x == game.perso.pos.x && virtuals[i].y == game.perso.pos.y ) {
            game.perso.die();
         }
      }
      setTimeout(function(){
         game.elements.area.case[selectDiv.x][selectDiv.y].style.backgroundColor = 'white';
         for ( var i = 0 ; i<touched.length; i++) {
            // console.log(touched[i]);
            touched[i].classList.remove('bombed');
            touched[i].setAttribute('bombed',0);
         }
      }, 1000);
   }, game.data.bombDelay);

}
// init grid 
game.elements.area.init();
game.perso.methods.init();
game.perso.methods.deplace();
game.elements.area.wall();