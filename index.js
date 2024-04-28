const express  = require("express");
const app = express();
const bodyParser = require("body-parser");
const session = require("express-session");
const connection = require ("./database/database");

const CategoriesControllers = require("./categories/CategoriesControllers");
const ArticlesController = require ("./articles/ArticlesController");
const usersController = require("./user/UsersController");

const Article = require("./articles/Article");
const Category = require("./categories/Category");
const User = require("./user/User");

app.set('view engine','ejs');

app.use(session({
    secret: "qualquercoisa", cookie: {maxAge: 3000000 }
}))


app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended : false}));
app.use(bodyParser.json());

connection
.authenticate()
.then(() => {
    console.log("conexão feita")
}).catch((error) => {
    console.log(error);
})


app.use("/",CategoriesControllers);
app.use("/",ArticlesController);
app.use("/",usersController);

app.get ("/", (req, res) =>{
    Article.findAll({
        order:[
            ['id','DESC']
        ], limit : 4
    }).then(articles=>{
        Category.findAll().then(categories=>{
            res.render("index",{articles:articles, categories: categories});
    });
    });
});

app.get("/:slug", (req,res)=>{
    var slug = req.params.slug;
    Article.findOne({
    where:{
        slug:slug
    }
    }).then(article=>{
        if(article != undefined){
            Category.findAll().then(categories=>{
                res.render("article",{article:article, categories: categories});
            });
        }else{
            res.redirect("/");
        }
    }).catch(err => {
    res.redirect("/");
    });
})

app.get("/category/:slug", (req,res)=>{
    var slug = req.params.slug;
    Category.findOne({
        where:{
            slug:slug
        },
        include : [{model:Article}]
    }).then (category =>{
        if(category!= undefined){
            Category.findAll().then(categories=>{
                res.render("index",{articles:category.articles,categories:categories});
            });
    }else{
        res.redirect("/");
    }
}).catch(err =>{
    res.redirect("/");
})
})

app.listen(8080,()=>{
    console.log("O servidor rodou");
})