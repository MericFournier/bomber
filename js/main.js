
var game = {};
game.data = {}; 
game.data.numBlock                           = 300;
game.data.width                              = 33; // profondeur de ligne 
game.data.height                             = 21; // lignes 
game.data.increment                          = 30; // taille bloc
game.data.bombDelay                          = 1000; // délai explosion bombe
game.data.bombDuration                       = 500; // durée explosion 
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
         gameCase.classList.add('case','str1');
         gameCase.style.width = game.data.increment+'px';
         gameCase.style.height = game.data.increment+'px'; 
         gameCase.setAttribute('data-id',inc);
         gameCase.setAttribute('bombed',0);
         gameCase.setAttribute('type','0');
         game.elements.area.case[i].push(gameCase);

         // création des murs 'indestructibles' de base
         if ( i%2 != 0 && j%2 != 0 ){
            gameCase.classList.remove('str1');
            gameCase.classList.add('str3');
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
            game.elements.area.case[i][j].classList.remove('str1');
            game.elements.area.case[i][j].classList.add('str2');
            game.elements.area.case[i][j].setAttribute('type',1);
         }
         if ( i%2 == 0 && j%2 != 0 ) {
            //console.log(game.elements.area.case[i][j]);
            game.elements.area.case[i][j].classList.remove('str1');
            game.elements.area.case[i][j].classList.add('str2');
            game.elements.area.case[i][j].setAttribute('type',1);
         }

         game.elements.area.case[0][1].classList.remove('str2');
         game.elements.area.case[0][1].classList.add('str1');
         game.elements.area.case[0][1].setAttribute('type',0);
         
         game.elements.area.case[1][0].classList.remove('str2');
         game.elements.area.case[1][0].classList.add('str1');
         game.elements.area.case[1][0].setAttribute('type',0);
         
         game.elements.area.case[game.data.height-2][game.data.width-1].classList.remove('str2');
         game.elements.area.case[game.data.height-2][game.data.width-1].classList.add('str1');
         game.elements.area.case[game.data.height-2][game.data.width-1].setAttribute('type',0);
         
         game.elements.area.case[game.data.height-1][game.data.width-2].classList.remove('str2');
         game.elements.area.case[game.data.height-1][game.data.width-2].classList.add('str1');
         game.elements.area.case[game.data.height-1][game.data.width-2].setAttribute('type',0);
         


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
         //console.log('click');
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
         //console.log('click');
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
         //console.log('click');
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
         //console.log('click');
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
      // adversaire 
      else if ( event.keyCode == 81) {
         if ( game.adversaire.left == 0) {
            return false;
         }
         game.adversaire.left -= 1;
         game.adversaire.top = game.adversaire.top;
         var type = game.elements.area.case[game.adversaire.top][game.adversaire.left].getAttribute('type');
         if ( type > 0) {
            game.adversaire.left += 1;
            return false;
         }
         game.adversaire.methods.position(game.adversaire.top,game.adversaire.left);
         if ( game.elements.area.case[game.adversaire.top][game.adversaire.left].getAttribute('bombed') == 1 ) {
            game.adversaire.die();
         }
      }
      else if ( event.keyCode == 90 ){
         if ( game.adversaire.top == 0) {
            return false;
         }
         game.adversaire.left = game.adversaire.left;
         game.adversaire.top -= 1;
         var type = game.elements.area.case[game.adversaire.top][game.adversaire.left].getAttribute('type');
         if ( type > 0) {
            game.adversaire.top += 1;
            return false;
         }
         game.adversaire.methods.position(game.adversaire.top,game.adversaire.left);
         if ( game.elements.area.case[game.adversaire.top][game.adversaire.left].getAttribute('bombed') == 1 ) {
            game.adversaire.die();
         }

      }
      else if ( event.keyCode == 68 ){
         if ( game.adversaire.left == (game.data.width - 1)) {
            return false;
         }
         game.adversaire.left += 1;
         game.adversaire.top = game.adversaire.top;
         var type = game.elements.area.case[game.adversaire.top][game.adversaire.left].getAttribute('type');
         if ( type > 0) {
            game.adversaire.left -= 1;
            return false;
         }
         game.adversaire.methods.position(game.adversaire.top,game.adversaire.left);
         if ( game.elements.area.case[game.adversaire.top][game.adversaire.left].getAttribute('bombed') == 1 ) {
            game.adversaire.die();
         }
      }
      else if ( event.keyCode == 83 ){
         if ( game.adversaire.top == (game.data.height - 1)) {
            return false;
         }
         game.adversaire.left = game.adversaire.left;
         game.adversaire.top += 1;
         var type = game.elements.area.case[game.adversaire.top][game.adversaire.left].getAttribute('type');
         if ( type > 0) {
            game.adversaire.top -= 1;
            return false;
         }
         game.adversaire.methods.position(game.adversaire.top,game.adversaire.left);
         if ( game.elements.area.case[game.adversaire.top][game.adversaire.left].getAttribute('bombed') == 1 ) {
            game.adversaire.die();
         }
      }
      // 
      else if ( event.keyCode == 13 ){
         //console.log('bomb');
         game.bomb.methods.setBomb(game.adversaire.top,game.adversaire.left);
      }
      else if ( event.keyCode == 32 ){
         console.log('click');
         //console.log('bomb');
         game.bomb.methods.setBomb(game.perso.top,game.perso.left);
      }
   }

}
game.perso.methods.deplace();
// gestion Adversaire 
game.adversaire = {}; 
game.adversaire.object                       = document.createElement('div');
game.adversaire.object.classList.add('adversaire');
game.adversaire.object.style.width                = game.data.increment+'px';
game.adversaire.object.style.height               = game.data.increment+'px';
game.adversaire.top                               = game.data.height-1;
game.adversaire.left                              = game.data.width-1;
game.adversaire.pos                               = {x:game.adversaire.top, y:game.adversaire.left};
game.adversaire.methods                           = {};
game.adversaire.methods.init                      = function() {
   game.elements.area.container.append(game.adversaire.object);
   game.adversaire.top                               = game.data.height-1;
   game.adversaire.left                              = game.data.width-1;
   game.adversaire.methods.position(game.adversaire.top,game.adversaire.left);
}
game.adversaire.die = function(){
   console.log('dead');
   game.adversaire.top = game.data.height-1;;
   game.adversaire.left = game.data.width-1;;
   game.adversaire.methods.position(game.adversaire.top,game.adversaire.left);
}
game.adversaire.methods.position                 = function(top,left) {
   game.adversaire.top                               = top;
   game.adversaire.left                              = left;
   top = top*game.data.increment;
   left = left*game.data.increment;
   //console.log(game.perso.top +' '+game.perso.left);
   game.adversaire.object.style.top = top+"px";
   game.adversaire.object.style.left = left+"px";
   game.adversaire.object.style.background = 'black';
   game.adversaire.pos = {x:game.adversaire.top, y:game.adversaire.left};

   //console.log('new position :',game.adversaire.pos );
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
game.bomb.methods.setBomb                    = function(top,left) {

   var selectDiv = {x:top,y:left};
   var touched = [];
   var virtuals = []; 
   game.elements.area.case[selectDiv.x][selectDiv.y].style.backgroundColor = 'yellow';

   if ( game.elements.area.case[selectDiv.x][selectDiv.y] ) {
      touched.push(game.elements.area.case[selectDiv.x][selectDiv.y]);
      virtuals.push({x:selectDiv.x, y:selectDiv.y}); 
   }
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
   console.log('touched',touched);
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
      for ( var i = 0; i<virtuals.length; i++) {
         if ( virtuals[i].x == game.adversaire.pos.x && virtuals[i].y == game.adversaire.pos.y ) {
            game.adversaire.die();
         }
      }
      setTimeout(function(){
         game.elements.area.case[selectDiv.x][selectDiv.y].style.backgroundColor = 'white';
         for ( var i = 0 ; i<touched.length; i++) {
            // console.log(touched[i]);
            touched[i].classList.remove('bombed');
            touched[i].setAttribute('bombed',0);
         }
      }, game.data.bombDuration);
   }, game.data.bombDelay);

}

game.ai = {};
game.ai.object = document.createElement('div');
game.ai.choice = [];
game.ai.way = [];
game.ai.fuite = [];
game.ai.history = [];  
game.ai.init = function() {
   //console.log('choice');
   game.ai.choice = [];
   game.ai.way = []; 

console.clear();
   // case où on est 
   console.log('case interdite :');
   if (game.ai.history[game.ai.history.length-1] ) { 
      console.log(game.ai.history[game.ai.history.length-1]);
      console.log(game.elements.area.case[game.ai.history[game.ai.history.length-1].x][game.ai.history[game.ai.history.length-1].y]);
   }
   else {
      console.log('aucune');
   }
   

   game.ai.history.push(game.adversaire.pos);
   console.log('différents choix');

   if (game.elements.area.case[game.adversaire.pos.x+1]) {
      data = {x:game.adversaire.pos.x+1, y:game.adversaire.pos.y};
      console.log('------');
      console.log(data);
      console.log(game.ai.history[game.ai.history.length-1]);
      console.log('------');
      if (data == game.ai.history[game.ai.history.length-1]) {
         console.log('!!!!!!!!!!');
         return false;
      }
      else {
      //console.log(data);
      game.ai.choice.push(data);
      }
   }
   if (game.elements.area.case[game.adversaire.pos.x-1]) {
      data = {x:game.adversaire.pos.x-1, y:game.adversaire.pos.y};
      console.log('------');
      console.log(data);
      console.log(game.ai.history[game.ai.history.length-1]);
      console.log('------');
      if (data == game.ai.history[game.ai.history.length-1]) {
         console.log('!!!!!!!!!!');
         return false;
      }
      else {
      //console.log(data);
      game.ai.choice.push(data);
      } 
   }
   if ( game.elements.area.case[game.adversaire.pos.x][game.adversaire.pos.y-1]) {
      data = {x:game.adversaire.pos.x, y:game.adversaire.pos.y-1} ;
      console.log('------');
      console.log(data);
      console.log(game.ai.history[game.ai.history.length-1]);
      console.log('------');
      if (data == game.ai.history[game.ai.history.length-1]) {
         console.log('!!!!!!!!!!');
         return false;
      }
      else {
      //console.log(data);
      game.ai.choice.push(data);
      } 
   }
   if ( game.elements.area.case[game.adversaire.pos.x][game.adversaire.pos.y+1]) {
      data = {x:game.adversaire.pos.x, y:game.adversaire.pos.y+1} ;
      console.log('------');
      console.log(data);
      console.log(game.ai.history[game.ai.history.length-1]);
      console.log('------');
      if (data == game.ai.history[game.ai.history.length-1]) {
         console.log('!!!!!!!!!!');
         return false;
      }
      else {
      //console.log(data);
      game.ai.choice.push(data);
      }
   }
   for ( var i = 0; i<game.ai.choice.length; i++) {
      console.log(game.elements.area.case[game.ai.choice[i].x][game.ai.choice[i].y]);
   }

   // on regarde parmis les routes les quelles on peut emprunter 
   for ( var i = 0; i<game.ai.choice.length; i++){
      //console.log('choix : '+game.ai.choice[i].x+' '+game.ai.choice[i].y);
      if ( game.elements.area.case[game.ai.choice[i].x][game.ai.choice[i].y].getAttribute('type') < 2) {
         // console.log('on ajoute à way :'+game.ai.choice[i] );
         game.ai.way.push(game.ai.choice[i]);
      }
   }




   // parmis celles empruntables on en choisit une 
   var random = Math.floor(Math.random()*game.ai.way.length);
   console.log('case choisie :'); 
   console.log(game.elements.area.case[game.ai.way[random].x][game.ai.way[random].y]);


   // on regarde si la route choisi est vide 
   var kind = parseInt(game.elements.area.case[game.ai.way[random].x][game.ai.way[random].y].getAttribute('type')); 
   // si oui , on y va 
   if ( kind == 0 ) {
      game.adversaire.methods.position(game.ai.way[random].x,game.ai.way[random].y);
   }

   // ou on détruit la brique 
   else {
      game.bomb.methods.setBomb(game.adversaire.pos.x,game.adversaire.pos.y);
   }
   console.log('nouvelle case interdite');
   console.log(game.elements.area.case[game.ai.history[game.ai.history.length-1].x][game.ai.history[game.ai.history.length-1].y]);
   
   





}
game.ai.selectDirection = function() {

}
game.ai.chooseDirection = function() {

}


// init grid 
game.elements.area.init();
game.elements.area.wall();
game.adversaire.methods.init();
game.perso.methods.init();
game.perso.methods.deplace();
setInterval(function(){
   game.ai.init();
}, 200 ); 

//document.onkeydown = function(event) {
//   if ( event.keyCode == 91) {
//      game.ai.init();
//   }
//}
