let joueur = function(nom)
{
    this.type = 1;
    this.ordinateur = "Imac";
    this.logiciel = "Sublime Text";
    this.programmer = function(){
        return this.nom + " programme sur "+ this.ordinateur;
    }
}