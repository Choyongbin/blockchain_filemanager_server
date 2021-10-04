var imgbox = document.getElementById('imgClass')
/*
const connection = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password : '1234',
    database : 'fileNFT'
  });
  
connection.connect()
*/
$(document).ready(function(){
    /*
    var sql = 'SELECT path from file'
    connection.query(sql, function(err, rows, fields){
        if(err){
            console.log(err)
        }
        else{
            for(var i = 0; i<rows.lenght; i++){
                console.log(rows[i])
            }
        }
    })
    */
    var img = document.createElement('img')
    img.src = 'Server.jpg'
    img.width = 400
    img.height = 500
    imgbox.appendChild(img)
    
})