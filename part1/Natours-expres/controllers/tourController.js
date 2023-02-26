const fs = require('fs');
const Tour = require('../models/tourModels')
// const tours = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`, 'utf8'))

exports.getAllTours = async(req, res) => {
    try{
        // BUILD QUERY
        // Filtering using where
        // const tours = await Tour.find().where('duration').equals(5).where('difficulty').equals('easy')
        console.log(req.query)

        //1. Filtering
        const queryObj = {...req.query}
        const excludedFields = ['page', 'sort', 'limit','fields'] //excluded object when we filter the data
        excludedFields.forEach(el => delete queryObj[el])


        //2. Advanced Filtering
        let queryStr = JSON.stringify(queryObj)
       queryStr = queryStr.replace(/\b(gte|lte|gt|lt)\b/g,match =>`$${match}`)
        console.log("dd")
        console.log(JSON.parse(queryStr))
      
        const query = await Tour.find(JSON.parse(queryStr));
        
        // Execute Query 

        const tours = await query

        //Send Response
        res.status(200).json({
            status:'success',
            results:tours.length,
            requestedAt: req.requestTime,
            data:{
                tours:tours 
            }
        })
    }  catch(err){
        res.status(500).json({
            status: 'fail',
            message: err
        })
        
    }
}

// exports.checkId = (req,res,next,val)=>{
//     const {id} = req.params;
//     let tour = tours.find(el=> el.id == id)
//     if(!tour){
//        return res.status(404).json({
//             status: 'fail',
//             message: 'tour not found'
//         })
//     }
//     next();
// }

// exports.checkBody =(req,res,next)=>{
//     const {name,price} = req.body;
//     if(!name || !price){
//         return res.status(400).json({
//             status: 'fail',
//             message: 'Missing name or price'
//         })

//     }
//     next()

// }

exports.getTour = async (req, res) => {
    try{
        const {id} = req.params;
        const tour = await Tour.findById(id);
        // const tour = await Tour.findOne({_id: req.params.id})
      
        res.status(200).json({
            status:'success',
            data:{
                tour:tour 
            }
        })
    } catch(err) {
        res.status(404).json({
            status: 'fail',
            message: 'tour not found'
        })
    }
    

}

exports.createTour = async (req, res) => {
    console.log(req.body)
    try{
        console.log("created")
        
        const newTour = await Tour.create(req.body)
        res.status(201).json(
            {
                status: "success", 
                tours: newTour
            })
    } catch(err){
        res.status(400).json(
            {
                status: "fail", 
                message:err
                
            })
    }

}

exports.updateTour = async (req, res) => {
   
    try{
        const {id} = req.params;
        const tour = await Tour.findByIdAndUpdate(id, req.body, ({
            new:true,
            runValidators: true
        }));
        res.status(200).json({
            status:'success',
            data:{
                tour
            }
        })
    }catch(err){
        res.status(500).json({
            status: 'fail',
            message: err
        })
    }
}

exports.deleteTour =  async (req, res) => {
  
    try{
        const{id} = req.params
       await Tour.findByIdAndDelete(id)
        console.log('Deleted')
        res.status(204).json({
            status:'success',
            data:null
        })
    } catch(err){
        res.status(400).json({
            status:'success',
            message:"Something is happened during"
        })
    }
   
}
