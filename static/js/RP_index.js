$(function(){

	buttonInit();

});

function buttonInit(){
	$("#hospitalLogin, #homeLogin").on('click', function(e){
		e.preventDefault();
		let url = "/dashboard?uid=1";
		window.location.href = url;
	});
}