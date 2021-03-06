//timer

// Update the count down every 1 second
var x = setInterval(function() {
	projects.forEach(function(project, pid){
	    // Get date and time
	    var now = new Date().getTime();
	    
	    // Find the distance between now an the count down date
	    var distance = new Date(project.endTime).getTime() - now;
	    
	    // Time calculations for days, hours, minutes and seconds
	    var days = Math.floor(distance / (1000 * 60 * 60 * 24));
	    var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
	    var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
	    var seconds = Math.floor((distance % (1000 * 60)) / 1000);
	    
	    var elementId = "demo_" + pid;
	    // Output the result in an element with id="demo_{$id}"
	    document.getElementById(elementId).innerHTML = days + "d " + hours + "h "
	    + minutes + "m " + seconds + "s ";
	    
	    // If the count down is over, write some text 
	    if (distance < 0) {
	        //projects.splice()
	        document.getElementById(elementId).innerHTML = "EXPIRED";
	    }
	});
	if (projects.length == 0){
		clearInterval(x);
	}
}, 1000);