const catchAsync = require('./../utils/catchAsync')
const AppError = require('./../utils/AppError')
const {Data} = require('./../utils/utilApp');

exports.deleteOne = Model=> catchAsync(async (req, res, next) => {
    const{id} = req.params
   const doc = await Model.findByIdAndDelete(id)
    if(!doc){
        return next(new AppError(`No doc is found with this id`, 404))
     }
    console.log('Deleted')
    res.status(204).json({
        status:'success',
        data:null
    })
   
  
})

exports.updateOne = Model=> catchAsync(async (req, res, next) => {
    const {id} = req.params;
    const doc = await Model.findByIdAndUpdate(id, req.body, ({
        new:true,
        runValidators: true
    }));

    if(!doc){
        return next(new AppError(`No document is  found with this ID`, 404))
     } 
    res.status(200).json({
        status:'success',
        data:{
           data: doc
        }
    })
})

exports.createOne = Model => catchAsync(async (req, res, next) => {
    
    console.log("created")
    
    const newDoc = await Model.create(req.body)
    res.status(201).json(
        {
            status: "success", 
            data: {
                data: newDoc
            }
        })

})

exports.getOne = (Model, popOptions)=> catchAsync(async (req, res, next) => {
 
    const {id} = req.params;
    let query = Model.findById(id)
    if(popOptions){
        query = query.populate(popOptions)
    }
    const doc = await query
    // const doc = await Model.findById(id).populate();
    // const doc = await doc.findOne({_id: req.params.id})
  
    
    if(!doc){
       return next(new AppError(`No Document found`, 404))
    }
    res.status(200).json({
        status:'success',
        data:{
            data:doc 
        }
    })
})

exports.getAll = Model => catchAsync(async(req, res, next) => {

    const doc = await Data(req,Model)
    //Send Response
    if(doc.length=== 0){
        // console.log("No doc found")
        return next(new AppError(`No doc is found`, 404))
     }
    res.status(200).json({
        status:'success',
        results:doc.length,
        data: {
            doc:doc
        }
    })

})

