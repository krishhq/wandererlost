const Joi=require("joi");


const listingSchema=Joi.object({
    listing : Joi.object({
        title:Joi.string().min(5).max(100).required(),
        description:Joi.string().min(10).max(500).required(),
        location:Joi.string().min(1).max(500).required(),
        country:Joi.string().min(1).max(200).required(),
        price:Joi.number().min(1).required(),
        image:Joi.string().allow("",null)
    })
});

const reviewSchema=Joi.object({
    reviews: Joi.object({
        comment:Joi.string().max(500),
        rating:Joi.string().min(0).max(10).required()
    }).required()
});


module.exports={reviewSchema, listingSchema};