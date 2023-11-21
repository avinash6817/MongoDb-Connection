const express = require("express");
const mongoose = require("mongoose")
const cors = require("cors");
require("dotenv").config()

const blogModel = require("./model/blog");

// calling the express function
const app = express();
const PORT = process.env.PORT;


// In Express, middleware functions are invoked using the --> app.use() method
app.use(express.json());
app.use(cors());


// Connecting to the database
mongoose.connect(process.env.MONGODB_URL)
.then(() => {
    app.listen((PORT), () => {
        console.log(`SERVER RUNNING ON THE PORT : ${PORT}`);
    })
    console.log("SUCCESSFULLY CONNECTED TO DATABASE")
})
.catch((err) => {
    console.log(err)
})



app.post('/add-blog', async (req, res) => {
    try {
        const blog = req.body;
        const newBlog = new blogModel(blog);
        await newBlog.save();
    
        res.status(201).json({ message: 'Post created successfully', blog: newBlog });
    } 
    catch (err){
        console.error(err);
        res.status(500).json({ err : 'Internal server error' });
    }
});
  

app.get('/get-all-blogs', async (req, res) => {
    try {
        const blogs = await blogModel.find();
        res.status(200).json(blogs);
    } 
    catch (err) {
        console.error(err);
        res.status(500).json({ err : 'Internal server error' });
    }
});


app.delete('/delete-blog/:id', async (req,res) => {
    try{
        const blogId = req.params.id;
    
        const deletedBlog = await blogModel.findByIdAndDelete(blogId);
    
        if (!deletedBlog) {
            return res.status(404).json({ error: 'blog not found' });
        }

        res.status(200).json({ message: 'blog deleted successfully', blog : deletedBlog });
    }
    catch(err){
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
})


app.put('/update-blog/:id', async (req,res) => {
    try {
        const blogId = req.params.id;
        const {title,content} = req.body;

        const updatedBlog = await blogModel.findByIdAndUpdate(blogId, {title,content})

        if (!updatedBlog) {
            return res.status(404).json({ error: 'Blog not found' });
        }
      
        res.status(200).json({ message: 'Blog updated successfully', blog : updatedBlog });
    } 
    catch (err) {
        console.error(err);
        res.status(500).json({ err : 'Internal server error' });
    }
})

