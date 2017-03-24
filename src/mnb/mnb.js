;(function($){
    var uniqueCats = Array
        .apply(null, {length: 15})
        .map(function(n){
            return [];
        });
    console.log(uniqueCats);


    $(function(){
        Papa.parse("adult_data.csv", {
            download: true,
            step: function(row) {
                // console.log("Row:", row.data);
                row.data[0].forEach(function(el, i){
                    if(uniqueCats[i].indexOf(el) == -1){
                        uniqueCats[i].push(el);
                    }
                });
            },
            complete: function(results) {
                console.log(uniqueCats);
            }
        });
    });
})(jQuery);