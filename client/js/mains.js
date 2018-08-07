function getShortenedUrl() {
	var longUrl = $('#longUrl').val();
	if(!longUrl || longUrl==""){
		alert('Please enter a url');
		return;
	}
	$.ajax({
		url:"/api/short",
		method:"POST",
		data:{longUrl:longUrl},
		success:function(response) {
			// body...
			// $('#shortenedUrl').val = response.shortUrl
			$('#shortenedUrl').html(response.shortUrl);
		},
		error:function(xhr) {
			// body...
			console.log(xhr);
		}
	})
}