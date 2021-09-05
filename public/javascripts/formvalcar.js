var cars={
    Auto:['suca','è un auto'],
    Moto:['suca','è una moto'],
    Bici:['suca','è una Bici'],
    Monopattino:['suca','è un Monopattino']
}


var main= document.getElementById('main_menu');
var sub = document.getElementById('sub_menu');

main.addEventListener('change',function(){
    var selected_option = cars[this.value];

    while(sub.options.lenght > 0){
        sub.options.remove(0);
    }
    
    Array.from(selected_option).forEach(function(el){
        let option = new Option(el, el);
        sub.appendChild(option);



    })
    

})