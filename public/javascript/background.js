var counter = 0;
function changeBG(){
    var imgs = [
        "url(https://images.pexels.com/photos/261662/pexels-photo-261662.jpeg?w=940&h=650&dpr=2&auto=compress&cs=tinysrgb)",
        "url(https://images.pexels.com/photos/733856/pexels-photo-733856.jpeg?w=940&h=650&dpr=2&auto=compress&cs=tinysrgb)",
        "url(https://images.pexels.com/photos/273222/pexels-photo-273222.jpeg?w=940&h=650&dpr=2&auto=compress&cs=tinysrgb)",
        "url(https://images.pexels.com/photos/459654/pexels-photo-459654.jpeg?w=940&h=650&dpr=2&auto=compress&cs=tinysrgb)",
        "url(https://images.pexels.com/photos/7112/woman-typing-writing-windows.jpg?w=940&h=650&dpr=2&auto=compress&cs=tinysrgb)",
        "url(https://images.pexels.com/photos/34658/pexels-photo.jpg?w=940&h=650&dpr=2&auto=compress&cs=tinysrgb)",
        "url(https://images.pexels.com/photos/261577/pexels-photo-261577.jpeg?w=940&h=650&dpr=2&auto=compress&cs=tinysrgb)",
        "url(https://images.pexels.com/photos/8769/pen-writing-notes-studying.jpg?w=940&h=650&dpr=2&auto=compress&cs=tinysrgb)"
      ]
    
    if(counter === imgs.length) counter = 0;
    $("body").css("background-image", imgs[counter]);

    counter++;
}
  
  setInterval(changeBG, 4000);


