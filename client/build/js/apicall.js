
$(document).ready(()=>
    $("#submitButton").click(()=>{
        console.log("post api called")
        let username = $("#username").val();
        let email = $("#email").val();
        let mobile = $("#mobile").val() 
        //console.log($("#username").val())
        
        let userinfo = {
            "name": username,
            "email": email,
            "mobile": mobile
        }
        
        $.post("/api/websignup",userinfo,(data,status)=>{
            alert("data: "+data + "\nStatus: "+status);
        })
    })
)