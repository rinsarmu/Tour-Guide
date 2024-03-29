const mongoose = require('mongoose')
const Tour = require('./tourModels')

const reviewSchema = new mongoose.Schema({
    review: {
        type: String,
        required: [true, "Review  can not be emempty"]
    },
    rating: {
        type:Number,
        min:1,
        max:5
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        require: [true, 'A review must belong to the user']
    },
    tour:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tour',
        required: [true, "Review must belong to a tour"]
    },
  
},  
{
    toJSON:{ virtuals: true},
    toObject:{ virtuals: true}
})

// reviewSchema.pre(/^find/, function(){
//     this.find().select('- __v')
// })

//TO prevent duplicate review
reviewSchema.index({tour:1, user:1}, {unique: true})


reviewSchema.pre(/^find/, function(next){

    //Populating the reviews
    this
    // .populate({
    //     path: 'tour',
    //     select: 'name'
    // })
    .populate({
        path: 'user',
        select: "name, role"
    })

    next()
})

reviewSchema.statics.calcAverageRatings =async function(tourId){
   const stats =  await this.aggregate([
        {
            $match: {tour: tourId}
        },
        {
            $group:{
                _id: '$tour',
                nRating: {$sum: 1},
                avgRating:{$avg: '$rating'}
            }
        }
    ])
    if(stats.length > 0){
        await Tour.findByIdAndUpdate(tourId,{
            ratingsAverage: stats[0].avgRating,
            ratingsQuantity: stats[0].nRating
        })
    } else {
        await Tour.findByIdAndUpdate(tourId,{
            ratingsAverage: 4.5,
            ratingsQuantity: 0
        })
    }
   
}

reviewSchema.post('save', function(){
    //this points to current review
    this.constructor.calcAverageRatings(this.tour)
    
})

reviewSchema.pre(/^findOneAnd/, async function(next){
    this.r = await this.findOne()
    next()
})

reviewSchema.post(/^findOneAnd/, async function(){
    //this points to current reviewhill
    console.log(this.r)
    console.error(this.r.constructor.calcAverageRatings(this.r.tour))
    // await  this.r.constructor.calcAverageRatings(this.r.tour)
})

// findByIdAndUpdate
// findByIdAndDelete

const Review = mongoose.model('Review', reviewSchema)

module.exports = Review
