// packages
const router = require('express').Router();
const db = require('../models');
const seeder = require("../scripts/seedDB")

const random = (a,b,c,d) => {
  const centerLat = 33.68;
  const centerLng = -117.78;
  const x = (Math.random()-.5)*.2;
  const yComp = ((Math.random()-.5) > 0 ? 1 : -1) * ((.01-x**2)**.5);
  const y = Math.random()*yComp;
  return {lat:centerLat+x,lng:centerLng+y}
}

router.get('/dashboard', (req, res) => {
    res.status(200).json({
      // user values passed through from auth middleware
      user: req.user
    });
  });

//Returns all user coords
router.get('/coords', (req,res) => {
  db.User
    .find({}, {lat:1, lng:1})
    .then(dbModel => {
      res.json(dbModel)
    })
    .catch(err => res.status(422).json(err));
});

router.get('/coords/simulated/:count', ({params:{count}},res)=>{
  console.log(count)
  const randomized = [...Array(+count).keys()].map(a=> random())
  console.log(randomized)
  res.json(randomized)
}) 

router.post("/runseed", (req,res)=> {
  if(req.body.secret === "jayiscool"){
    seeder().then(data=> res.json("SUCCESSFULLY SEEDED!"))
  }else{
    res.json("You are not allowed to seed the DB Sederick!")
  }
  
})
  

//Test Data
// const data = {
//   0:  {
//       longitude: -117.345294095493,
//       latitude: 33.6757093704097
//       },
//   1:  {
//       longitude: -117.862294095493,
//       latitude: 33.7257093704097
//       },
//   2:  {
//       longitude: -117.834294095493,
//       latitude: 33.7257093704097
//       },
//   3:  {
//       longitude: -117.745294095493,
//       latitude: 33.7677093704097
//       },
//   4:  {
//       longitude: -117.975294095493,
//       latitude: 33.8017093704097
//       },
//   5:  {
//       longitude: -117.845294095493,
//       latitude: 33.7737093704097
//       },
//   6:  {
//         longitude: -117.837294095493,
//         latitude: 33.7257093704097
//       },
//   7:  {
//         longitude: -117.742294095493,
//         latitude: 33.6787093704097
//       },
//   8:  {
//         longitude: -117.247294095493,
//         latitude: 33.9767093704097
//       },
//   9:  {
//         longitude: -117.341294095493,
//         latitude: 33.4657093704097
//       },
//   10:  {
//         longitude: -117.673294095493,
//         latitude: 33.5347093704097
//       },
//   11:  {
//         longitude: -117.765294095493,
//         latitude: 33.4787093704097
//       }
// };
  module.exports = router;