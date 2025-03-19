import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(

    {
        Email: {
            type: String,
            required: true,
            unique: true,
        },
        FullName: {
            type: String,
            // notice how we declare string with capital S
            required: true,
        },
        Password: {
            type: String,
            required: true,
            minlength: 6,
        },
        ProfilePic: {
            type: String,
            default: "",
        }
    }, { timestamps: true }
    // to define created and updatedat fields
);

const User = mongoose.model("User", UserSchema);
// first letter of model must be capital and model name should be singular so that when mongoose creates the model it will automatically convert it to users instead of User

export default User;