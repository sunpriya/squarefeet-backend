function validateName()
{
	var x=document.forms['username']['Name'].value;
	if(x=="")
		{
			document.alert("Wrong Name");
			return false;
		}

}
function validateEmail()
{
	var email = document.getElementById('email');
    var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;

    if (!filter.test(email.value)) {
    alert('Please provide a valid email address');
    email.focus;
    return false;

}
function validateMobile()
{
	var val = document.forms['mobile']['mobile'].value;
	if (/^\d{10}$/.test(val)) {
	    // value is ok, use it
	} else {
	    alert("Invalid number")
	    number.focus()
	    return false
}
}
