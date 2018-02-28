var bodyParser          =require("body-parser"),
    methodOverride      =require("method-override");
    mongoose            =require("mongoose"),
    express             =require("express"),
    expressSanitizer    =require("express-sanitizer"),
    passport         =require("passport"),
    LocalStrategy    =require("passport-local"),  
    passportLocalMongoose=require("passport-local-mongoose")
    app                 =express();
   

// mongoose.connect("mongodb://localhost/blogapp");
mongoose.connect("mongodb://notiondb:notiondb@ds151528.mlab.com:51528/notion");

app.set("view engine","ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
//sanitizer must be used after body parser
app.use(expressSanitizer());
app.use(methodOverride("_method"));


//======================================================
var blogSchema=new mongoose.Schema({
    title:String,
    image:String,
    body:String,
    created: {type:Date , default:Date.now },
    author:{
        id:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        },
        username:String
    },

});
var blog=mongoose.model("blog",blogSchema);

var UserSchema =new mongoose.Schema({
    username:String,
    password:String
});
UserSchema.plugin(passportLocalMongoose);

var User =mongoose.model("User",UserSchema);


//=========================================//
//configuring passport
app.use(require("express-session")({
    secret: "Once again Rusty wins cutest dog!",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
   res.locals.currentUser = req.user; //currentUser is the name of variable to be used in ejs file
   next();
});


// for(var j =0 ; j<3; j++){
//     blog.create({
//         title:"test blog",
//         image:"http://78.media.tumblr.com/tumblr_lx73nmlnY21qlfjv8o1_500.jpg",
//         body:"hellothis is blog post"
//     });
// }

app.get("/",function(req,res){
    res.render("firstpage");
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
app.get("/blogs/new",isLoggedIn,function(req,res){
    res.render("new");
})
//create route
app.post("/blogs",isLoggedIn,function(req,res){
    //create blog
    //console.log(req.body);
    req.body.blogbody=req.sanitize(req.body.blogbody);
    var newBlog={
                title:req.body.title,
                image:req.body.image,
                body:req.body.blogbody,
                author:{
                    id:req.user._id,
                    username:req.user.username
                },

    }
    //console.log(req.body);
    
    blog.create(newBlog,function(err,newBlog){
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
app.get("/blogs/:id/edit",checkBlogOwnership,function(req,res){
   blog.findById(req.params.id,function(err,foundBlog){
    if(err)
    res.redirect("/blogs");
    else
    res.render("edit",{blog:foundBlog});
   });
})
//update route
app.put("/blogs/:id",checkBlogOwnership,function(req,res){
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
app.delete("/blogs/:id",checkBlogOwnership,function(req,res){
    blog.findByIdAndRemove(req.params.id,function(err){
        if(err)
       res.redirect("/blogs");
        else
        res.redirect("/blogs");
    });
})

//=====================================

function checkBlogOwnership(req,res,next){
    if(req.isAuthenticated()){
        blog.findById(req.params.id,function(err,foundBlog){
            if(err)
            res.redirect("back");
            else{
                //check the authorisation 
                if(foundBlog.author.id.equals(req.user._id))
                next();
                else
                res.redirect("back");
            }

        });
    }
    else
    res.redirect("back");
}


//======================================
function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}
//=================================

//========================================
//auth routes
//========================================
app.get("/register",function(req,res){
    res.render("register");
});

//handles the sign up process

app.post("/register",function(req,res){
    var newUser={
                    username:req.body.username,
                }
    User.register(newUser,req.body.password,function(err,user){
        if(err){
            console.log(err);
            return res.render("register");
        }
        passport.authenticate("local")(req,res,function(){
            res.redirect("/blogs");
        })        
    });

});

//add a login route

app.get("/login",function(req,res){
    res.render("login");
});

//login logic

app.post("/login",passport.authenticate("local",
    {
        successRedirect: "/blogs",
        failureRedirect: "/login"
    }), function(req, res){
});
//adding a logout route
app.get("/logout",function(req,res){
    req.logOut();
    res.redirect("/");
});

function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}
//=============================================

app.listen(process.env.PORT||3000,function(){
    console.log("server started");
});