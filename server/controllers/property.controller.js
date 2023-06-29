import mongoose from 'mongoose';
import Property from '../mongodb/models/property.js';
import User from '../mongodb/models/user.js';
import * as dotenv from 'dotenv';

//cloudinary
import { v2 as cloudinary} from 'cloudinary';

dotenv.config(); //dotenv instance

//conection to cloudinary
cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET  
  });


const getAllProperties = async (req, res) => {
    try {
        const properties = await Property.find({}).limit(req.query._end);

        res.status(200).json(properties);

    } catch (error) {
        res.status(500).json({ message: error.message});
    }
 };

const getPropertyDetail = (req, res) => { };


const createProperty = async (req, res) => {
    
    try{
        const { title, description, propertyType, location, price, photo, email} = req.body;

        //Start a new session . Mongoose property. To make Atomic the insertion
        const session = await mongoose.startSession();
        session.startTransaction();

        const user = await User.findOne({ email }).session(session);
        
        if(!user) throw new Error('User not found');

        //Using cloudinary
        const photoUrl = await cloudinary.uploader.upload(photo);

        const newProperty = await Property.create({
            title,
            description,
            propertyType,
            location,
            price,
            photo: photoUrl.url,
            creator: user._id
        });

        //update del dato creado
        user.allProperties.push(newProperty._id);
        await user.save({ session});

        await session.commitTransaction();
        //response
        res.status(200).json({ message: 'Property created sucessfully' });
    }catch(error){
        res.status(500).json({ message: error.message});
    };
 };

const updateProperty = (req, res) => { };
const deleteProperty = (req, res) => { };

export {
    getAllProperties,
    getPropertyDetail,
    createProperty,
    updateProperty,
    deleteProperty,
}
