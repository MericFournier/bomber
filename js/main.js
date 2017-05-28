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
      this.position.left = left;
      this.position.top = top;
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
      if ( this.history.length > 1) {
         this.history.push({x:this.position.x,y:this.position.y});
      }
   }
   this.setPosition = function(top,left) {
      this.position.left = left;
      this.position.top = top;
      this.history.push(game.elements.area.case[this.position.top][this.position.left]);
      top = top*game.data.increment;
      left = left*game.data.increment;
      //console.log(game.perso.top +' '+game.perso.left);
      this.object.style.top = top+"px";
      this.object.style.left = left+"px";
   }
   this.die = function(){
      //console.log('dead');
      this.position.top = game.data.height-1;
      this.position.left = game.data.width-1;
      this.setPosition(this.position.top,this.position.left);
   }
   this.choices = [];
   this.ways = [];
   this.history = [];
   this.setChoices = function() 
   {
      if(game.elements.area.case[this.position.top+1]){
         this.choices.push({x:this.position.top+1,y:this.position.left});
      }
      if(game.elements.area.case[this.position.top-1]){
         this.choices.push({x:this.position.top-1,y:this.position.left});
      }
      if(game.elements.area.case[this.position.top][this.position.left+1]){
         this.choices.push({x:this.position.top,y:this.position.left+1});
      }  
      if(game.elements.area.case[this.position.top][this.position.left-1]){
         this.choices.push({x:this.position.top,y:this.position.left-1});
      }
      this.setWay();
   }
   this.setWay = function() {
      for ( var i = 0; i<this.choices.length; i++) {
         //console.log(this.choices[i]);
         if (game.elements.area.case[this.choices[i].x][this.choices[i].y].case.getAttribute('type') != 2 ) {
            this.ways.push(this.choices[i]);
         }
      }
      //console.log(this.ways);
      this.choose();
   }
   this.choose = function() {
      var random = Math.floor(Math.random()*this.ways.length);
      this.setPosition(this.ways[random].x,this.ways[random].y);
      console.log('choix',this.ways[random],game.elements.area.case[this.ways[random].x][this.ways[random].y].case);
      console.log(this.history);


   }
   this.aiInit = function() {
      console.log('case de ou je viens ',this.history[this.history.length-1].case);
      console.log(this.history);
      this.choices = [];
      this.ways = [];
      this.setChoices();
   }
}

var caseBlock = function() {
   this.case = document.createElement('div');
   this.case.style.width = game.data.increment+"px";
   this.case.style.height = game.data.increment+"px";
   this.case.classList.add('case');
   this.case.classList.add('str1');
}




// iappel func 
game.methods = {};
game.methods.deplace                   = function() {
   document.onkeydown = function(event) {
      if ( event.keyCode == 91) {
         game.adversaire.aiInit();
      }
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
game.elements.area.init();
game.elements.area.wall();


game.perso = new player();
game.perso.init();

game.adversaire = new adversaire();
game.adversaire.init();




//game.adversaire.methods.init();
//game.perso.methods.init();
//game.perso.methods.deplace();


//document.onkeydown = function(event) {
//   if ( event.keyCode == 91) {
//      game.ai.init();
//   }
//}

