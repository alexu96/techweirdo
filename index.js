const Sequelize = require('sequelize');
const express = require('express');
const bodyParser = require('body-parser');
const { STRING } = require('sequelize');
const { faker } = require('@faker-js/faker');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const sequelize = new Sequelize('assignment', 'root', 'root', {
    host: 'localhost',
    port: 3306,
    dialect: 'mysql'
});

sequelize.authenticate().then(()=>{
    console.log("connection successful");
}).catch((err)=>{
    console.log(err)
})

const users = sequelize.define('users', {
    id: {
        primaryKey: true,
        type: Sequelize.UUID,
    },
    fname: Sequelize.STRING,
    lname: Sequelize.STRING,
    password:Sequelize.STRING,
    email:Sequelize.STRING,
    city:Sequelize.STRING,
    state:Sequelize.STRING,
    country:Sequelize.STRING,   
});



users.sync().then((data) => {
    console.log("connected")
}).catch((err)=>{
    console.log(err)
});

app.post('/generateUsers', async (req, res) => {
    for (var i = 0; i < 5000; i++) {
		await users.insert({
            id:i,
			fname: faker.name.firstName(),
			lname: faker.name.lastName(),
			password: faker.internet.password(),
            email: faker.address.email(),
			city: faker.address.city(),
			state: faker.address.state(),
			country: faker.address.country(),
		});
        res.send("inserted 5000")
		
    } 
});

//1
app.get('/getAllusers', async (req, res) => {
    const allusers=await users.findAll({limit:10});
    res.send(allusers);
})

//2
app.post('/createUser', async (req, res) => {
    await users.create({id:req.body.id,fname:req.body.fname,lname:req.body.lname,password:req.body.password,email:req.body.email,city:req.body.city,state:req.body.state,country:req.body.country});
    res.send("User created");
})

//3
app.post('/updateUser', async (req, res) => {
    const updatedUser=await users.update({
        fname:req.body.fname,
        lname:req.body.lname,
        city:req.body.city,
        state:req.body.state,
        country:req.body.country

    },
    {
        where : { id:req.body.id}
    }
    )
    res.send(updatedUser);
})

//4
app.get('/getUserById', async (req, res) => {
    const userDetails=await users.findOne({id:req.body.id})
    res.send(userDetails)
})

app.listen(3000, function () {
    console.log('Express server is listening on port 8000');
});