    function startsessionTimer(){
            var cd = $('#countdownSecond');
            var cdm = $('#countdownMinutes');
            var c = parseInt(cd.text(),10);
            var m =  parseInt(cdm.text(),10);
            //alert(" Time for session validy is "+m +" minutes :"+ c+ " seconds");
            timer(cd , c , cdm ,  m);  
    }

    function timer(cd , c , cdm , m ){
        //alert(m);
        var interv = setInterval(function() {
            c--;
            cd.html(c);

            if (c == 0) {
                c = 60;
                m--;  
                $('#countdownMinutes').html(m);
                if(m<0)  {
                    clearInterval(interv); 
                    alert("time over");
                }                     
            }
        }, 1000);
    }