var game = {};
// DONNÉES 
game.data = {}; 
game.data.numBlock                           = 300;
game.data.width                              = 11; // profondeur de ligne 
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
         var gameCase = new caseBlock(); 
         game.elements.area.case[i].push(gameCase);

         // création des murs 'indestructibles' de base
         if ( i%2 != 0 && j%2 != 0 ){
            gameCase.case.classList.remove('str1');
            gameCase.case.classList.add('str3');
            gameCase.case.setAttribute('type','2');
            var data = {}
            data.i = i;
            data.j = j;
            game.elements.area.briques.push(data);
         }

         game.elements.area.container.appendChild(gameCase.case); 
      }   
   }
}
game.elements.area.wall                      = function () {
   for ( var i =0; i<game.elements.area.case.length; i++) {
      for ( var j =0; j<game.elements.area.case[i].length; j++) {
         if ( i%2 != 0 && j%2 == 0 ) {
            //console.log(game.elements.area.case[i][j]);
            game.elements.area.case[i][j].case.classList.remove('str1');
            game.elements.area.case[i][j].case.classList.add('str2');
            game.elements.area.case[i][j].case.setAttribute('type',1);
         }
         if ( i%2 == 0 && j%2 != 0 ) {
            //console.log(game.elements.area.case[i][j]);
            game.elements.area.case[i][j].case.classList.remove('str1');
            game.elements.area.case[i][j].case.classList.add('str2');
            game.elements.area.case[i][j].case.setAttribute('type',1);
         }

         game.elements.area.case[0][1].case.classList.remove('str2');
         game.elements.area.case[0][1].case.classList.add('str1');
         game.elements.area.case[0][1].case.setAttribute('type',0);

         game.elements.area.case[1][0].case.classList.remove('str2');
         game.elements.area.case[1][0].case.classList.add('str1');
         game.elements.area.case[1][0].case.setAttribute('type',0);

         game.elements.area.case[game.data.height-2][game.data.width-1].case.classList.remove('str2');
         game.elements.area.case[game.data.height-2][game.data.width-1].case.classList.add('str1');
         game.elements.area.case[game.data.height-2][game.data.width-1].case.setAttribute('type',0);

         game.elements.area.case[game.data.height-1][game.data.width-2].case.classList.remove('str2');
         game.elements.area.case[game.data.height-1][game.data.width-2].case.classList.add('str1');
         game.elements.area.case[game.data.height-1][game.data.width-2].case.setAttribute('type',0);



      }  
   }
}




var player = function() {
   this.position = {};
   this.position.left = 0;
   this.position.top = 0;
   this.object = document.createElement('div');
   this.object.classList.add('perso');
   this.object.style.width = game.data.increment+"px";
   this.object.style.height = game.data.increment+"px";
   this.init = function() {
      game.elements.area.container.append(this.object);
      this.position.top = 0;
      this.position.left = 0;
      this.setPosition(this.position.top,this.position.left);
   }
   this.setPosition = function(top,left) {
      top = top*game.data.increment;
      left = left*game.data.increment;
      //console.log(game.perso.top +' '+game.perso.left);
      this.object.style.top = top+"px";
      this.object.style.left = left+"px";
   }
   this.die = function(){
      //console.log('dead');
      this.position.top = 0;
      this.position.left = 0;
      this.setPosition(this.position.top,this.position.left);
   }
}

var adversaire = function() {
   this.position = {};
   this.position.left = game.data.width-1;
   this.position.top = game.data.height-1;
   this.object = document.createElement('div');
   this.object.classList.add('adversaire');
   this.object.style.width = game.data.increment+"px";
   this.object.style.height = game.data.increment+"px";
   this.init = function() {
      console.log('adversaire');
      game.elements.area.container.append(this.object);
      this.position.top = game.data.height-1;
      this.position.left = game.data.width-1;
      this.setPosition(this.position.top,this.position.left);
   }
   this.setPosition = function(top,left) {
      top = top*game.data.increment;
      left = left*game.data.increment;
      //console.log(game.perso.top +' '+game.perso.left);
      this.object.style.top = top+"px";
      this.object.style.left = left+"px";
   }
   this.die = function(){
      //console.log('dead');
      this.position.top = game.data.width-1;
      this.position.left = game.data.width-1;
      this.setPosition(this.position.top,this.position.left);
   }
}

var caseBlock = function() {
   this.case = document.createElement('div');
   this.case.style.width = game.data.increment+"px";
   this.case.style.height = game.data.increment+"px";
   this.case.classList.add('case');
   this.case.classList.add('str1');
}




game.ai = {};
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
// iappel func 
game.methods = {};
game.methods.deplace                   = function() {
   document.onkeydown = function(event) {

      if ( event.keyCode == 37) {
         //console.log('click');
         if ( game.perso.position.left == 0) {
            return false;
         }
         game.perso.position.left -= 1;
         game.perso.position.top = game.perso.position.top;
         var type = game.elements.area.case[game.perso.position.top][game.perso.position.left].case.getAttribute('type');
         if ( type > 0) {
            game.perso.position.left += 1;
            return false;
         }
         game.perso.setPosition(game.perso.position.top,game.perso.position.left);
         if ( game.elements.area.case[game.perso.position.top][game.perso.position.left].case.getAttribute('bombed') == 1 ) {
            game.perso.die();
         }
      }
      else if ( event.keyCode == 38 ){
         //console.log('click');
         if ( game.perso.position.top == 0) {
            return false;
         }
         game.perso.position.left = game.perso.position.left;
         game.perso.position.top -= 1;
         var type = game.elements.area.case[game.perso.position.top][game.perso.position.left].case.getAttribute('type');
         if ( type > 0) {
            game.perso.position.top += 1;
            return false;
         }
         game.perso.setPosition(game.perso.position.top,game.perso.position.left);
         if ( game.elements.area.case[game.perso.position.top][game.perso.position.left].case.getAttribute('bombed') == 1 ) {
            game.perso.die();
         }

      }
      else if ( event.keyCode == 39 ){
         //console.log('click');
         if ( game.perso.position.left == (game.data.width - 1)) {
            return false;
         }
         game.perso.position.left += 1;
         game.perso.position.top = game.perso.position.top;
         var type = game.elements.area.case[game.perso.position.top][game.perso.position.left].case.getAttribute('type');
         if ( type > 0) {
            game.perso.position.left -= 1;
            return false;
         }
         game.perso.setPosition(game.perso.position.top,game.perso.position.left);
         if ( game.elements.area.case[game.perso.position.top][game.perso.position.left].case.getAttribute('bombed') == 1 ) {
            game.perso.die();
         }
      }
      else if ( event.keyCode == 40 ){
         //console.log('click');
         if ( game.perso.position.top == (game.data.height - 1)) {
            return false;
         }
         game.perso.position.left = game.perso.position.left;
         game.perso.position.top += 1;
         var type = game.elements.area.case[game.perso.position.top][game.perso.position.left].case.getAttribute('type');
         if ( type > 0) {
            game.perso.position.top -= 1;
            return false;
         }
         game.perso.setPosition(game.perso.position.top,game.perso.position.left);
         if ( game.elements.area.case[game.perso.position.top][game.perso.position.left].case.getAttribute('bombed') == 1 ) {
            game.perso.die();
         }
      }












      // adversaire 
      else if ( event.keyCode == 81) {
         console.log('ok');
         console.log(game.adversaire.position);
         if ( game.adversaire.position.left == 0) {
            console.log('peut pas');
            return false;
         }
         game.adversaire.position.left -= 1;
         game.adversaire.position.top = game.adversaire.position.top;
         var type = game.elements.area.case[game.adversaire.position.top][game.adversaire.position.left].case.getAttribute('type');
         if ( type > 0) {
            game.adversaire.position.left += 1;
            return false;
         }
         game.adversaire.setPosition(game.adversaire.position.top,game.adversaire.position.left);
         if ( game.elements.area.case[game.adversaire.position.top][game.adversaire.position.left].case.getAttribute('bombed') == 1 ) {
            game.adversaire.die();
         }
      }
      else if ( event.keyCode == 90 ){
         console.log('ok');
         if ( game.adversaire.position.top == 0) {
            console.log('peut pas monter');
            return false;
         }
         game.adversaire.position.left = game.adversaire.position.left;
         console.log('ok');
         game.adversaire.position.top -= 1;
         console.log('ok');
         var type = game.elements.area.case[game.adversaire.position.top][game.adversaire.position.left].case.getAttribute('type');
         if ( type > 0) {
            console.log('okkkk');
            game.adversaire.position.top += 1;
            return false;
         }
         console.log('oké');
         game.adversaire.setPosition(game.adversaire.position.top,game.adversaire.position.left);
         console.log('oky');
         if ( game.elements.area.case[game.adversaire.position.top][game.adversaire.position.left].case.getAttribute('bombed') == 1 ) {
            game.adversaire.die();
         }

      }
      else if ( event.keyCode == 68 ){
         console.log('ok');
         if ( game.adversaire.position.left == (game.data.width - 1)) {
            return false;
         }
         game.adversaire.position.left += 1;
         game.adversaire.position.top = game.adversaire.position.top;
         var type = game.elements.area.case[game.adversaire.position.top][game.adversaire.position.left].case.getAttribute('type');
         if ( type > 0) {
            game.adversaire.position.left -= 1;
            return false;
         }
         game.adversaire.setPosition(game.adversaire.position.top,game.adversaire.position.left);
         if ( game.elements.area.case[game.adversaire.position.top][game.adversaire.position.left].case.getAttribute('bombed') == 1 ) {
            game.adversaire.die();
         }
      }
      else if ( event.keyCode == 83 ){
         console.log('ok');
         if ( game.adversaire.position.top == (game.data.height - 1)) {
            return false;
         }
         game.adversaire.position.left = game.adversaire.position.left;
         game.adversaire.position.top += 1;
         var type = game.elements.area.case[game.adversaire.position.top][game.adversaire.position.left].case.getAttribute('type');
         if ( type > 0) {
            game.adversaire.position.top -= 1;
            return false;
         }
         game.adversaire.setPosition(game.adversaire.position.top,game.adversaire.position.left);
         if ( game.elements.area.case[game.adversaire.position.top][game.adversaire.position.left].case.getAttribute('bombed') == 1 ) {
            game.adversaire.die();
         }
      }
      // 
      else if ( event.keyCode == 13 ){
         //console.log('bomb');
         game.methods.bomb(game.adversaire.position.top,game.adversaire.position.left); 
      }
      else if ( event.keyCode == 32 ){
         game.methods.bomb(game.perso.position.top,game.perso.position.left); 
      }
   }

}
game.methods.deplace();

game.methods.bomb = function(top,left) {
   var selectDiv = {x:top,y:left};
   console.log(selectDiv);
   var touched = [];
   var virtuals = []; 


   if ( game.elements.area.case[selectDiv.x][selectDiv.y] ) {
      touched.push(game.elements.area.case[selectDiv.x][selectDiv.y].case);
      virtuals.push({x:selectDiv.x, y:selectDiv.y});
      game.elements.area.case[selectDiv.x][selectDiv.y].case.classList='bombTarget';
      game.elements.area.case[selectDiv.x][selectDiv.y].case.classList.add('case');

   }
   if ( game.elements.area.case[selectDiv.x-1] ) {
      if ( game.elements.area.case[selectDiv.x-1][selectDiv.y]) {
         //console.log('haut');
         if ( game.elements.area.case[selectDiv.x-1][selectDiv.y].case.getAttribute('type')<2 ) {
            touched.push(game.elements.area.case[selectDiv.x-1][selectDiv.y].case);
            virtuals.push({x:selectDiv.x-1, y:selectDiv.y}); 
         }
      }
   }
   if ( game.elements.area.case[selectDiv.x+1] ) {
      if ( game.elements.area.case[selectDiv.x+1][selectDiv.y]) {
         //console.log('bas');
         if ( game.elements.area.case[selectDiv.x+1][selectDiv.y].case.getAttribute('type')<2 ) {
            touched.push(game.elements.area.case[selectDiv.x+1][selectDiv.y].case);
            virtuals.push({x:selectDiv.x+1, y:selectDiv.y});
         }
      }
   }
   if ( game.elements.area.case[selectDiv.x][selectDiv.y+1]) {
      //console.log('droite');
      if ( game.elements.area.case[selectDiv.x][selectDiv.y+1].case.getAttribute('type')<2 ) {
         touched.push(game.elements.area.case[selectDiv.x][selectDiv.y+1].case);
         virtuals.push({x:selectDiv.x, y:selectDiv.y+1});
      }
   }
   if ( game.elements.area.case[selectDiv.x][selectDiv.y-1]) {
      //console.log('gauche');
      if ( game.elements.area.case[selectDiv.x][selectDiv.y-1].case.getAttribute('type')<2 ) {
         touched.push( game.elements.area.case[selectDiv.x][selectDiv.y-1].case);
         virtuals.push({x:selectDiv.x, y:selectDiv.y-1});
      }
   }
   console.log('touched',touched);
   //console.log(virtuals);
   setTimeout(function(){ 
      for ( var i = 0 ; i<touched.length; i++) {
         //console.log(touched[i]);
         console.log(touched[i]);
         if ( touched[i].getAttribute('type') == 1) {
            touched[i].setAttribute('type',0);

         }
         touched[i].classList='';
         touched[i].classList.add('case','bombed');
      }
      for ( var i = 0; i<virtuals.length; i++) {
         if ( virtuals[i].x == game.perso.position.top && virtuals[i].y == game.perso.position.left ) {
            game.perso.die();
         }
      }
      for ( var i = 0; i<virtuals.length; i++) {
         if ( virtuals[i].x == game.adversaire.position.top && virtuals[i].y == game.adversaire.position.left ) {
            game.adversaire.die();
         }
      }
      setTimeout(function(){
         game.elements.area.case[selectDiv.x][selectDiv.y].case.style.backgroundColor = 'white';
         for ( var i = 0 ; i<touched.length; i++) {
            // console.log(touched[i]);
            touched[i].classList='';
            touched[i].classList.add('case','str1');
            touched[i].setAttribute('bombed',0);
         }
      }, game.data.bombDuration);
   }, game.data.bombDelay);

}

game.perso = new player();
game.perso.init();

game.adversaire = new adversaire();
game.adversaire.init();

game.elements.area.init();
game.elements.area.wall();
//game.adversaire.methods.init();
//game.perso.methods.init();
//game.perso.methods.deplace();


//document.onkeydown = function(event) {
//   if ( event.keyCode == 91) {
//      game.ai.init();
//   }
//}
