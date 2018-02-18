var bodyParser          =require("body-parser"),
    methodOverride      =require("method-override");
    mongoose            =require("mongoose"),
    express             =require("express"),
    expressSanitizer    =require("express-sanitizer"),
    app                 =express();
   

// mongoose.connect("mongodb://localhost/blogapp");
mongoose.connect("mongodb://blogappusername:rusty@ds141068.mlab.com:41068/blogapp");

app.set("view engine","ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
//sanitizer must be used after body parser
app.use(expressSanitizer());
app.use(methodOverride("_method"));

var blogSchema=new mongoose.Schema({
    title:String,
    image:String,
    body:String,
    created: {type:Date , default:Date.now }
});
var blog=mongoose.model("blog",blogSchema);

// for(var j =0 ; j<3; j++){
//     blog.create({
//         title:"test blog",
//         image:"http://78.media.tumblr.com/tumblr_lx73nmlnY21qlfjv8o1_500.jpg",
//         body:"hellothis is blog post"
//     });
// }

app.get("/",function(req,res){
    res.redirect("/blogs");
});

//index route
app.get("/blogs",function(req,res){

    blog.find({},function(err,blogs){
        if(err)
        console.log(err);
        else
        res.render("index",{blogs:blogs});
    });
   
});

//new route
app.get("/blogs/new",function(req,res){
    res.render("new");
})
//create route
app.post("/blogs",function(req,res){
    //create blog
    //console.log(req.body);
    req.body.blog.body=req.sanitize(req.body.blog.body);
    //console.log(req.body);
    blog.create(req.body.blog,function(err,newBlog){
        if(err)
        res.render("new");
        else{
            res.redirect("/blogs");
        }
    });
});

//show route
app.get("/blogs/:id",function(req,res){
    blog.findById(req.params.id,function(err,foundBlog){
        if(err)
        res.redirect("/blogs");
        else
        res.render("show",{blog:foundBlog});
    });

});
//edit route
app.get("/blogs/:id/edit",function(req,res){
   blog.findById(req.params.id,function(err,foundBlog){
    if(err)
    res.redirect("/blogs");
    else
    res.render("edit",{blog:foundBlog});
   });
})
//update route
app.put("/blogs/:id",function(req,res){
    //console.log(req.body);
    req.body.blog.body=req.sanitize(req.body.blog.body);
    //console.log(req.body);
    blog.findByIdAndUpdate(req.params.id,req.body.blog, function(err,updatedBlog){
        if(err){
            res.redirect("/blogs");
        }
        else
         res.redirect("/blogs/"+req.params.id);
    });
});
//delete route
app.delete("/blogs/:id",function(req,res){
    blog.findByIdAndRemove(req.params.id,function(err){
        if(err)
        res.redirect("/blogs");
        else
        res.redirect("/blogs");
    });
})

app.listen(process.env.PORT||3000,function(){
    console.log("server started");
});
