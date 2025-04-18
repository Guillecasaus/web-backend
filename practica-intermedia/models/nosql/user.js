const mongoose = require("mongoose");
const mongooseDelete = require("mongoose-delete");

const UserSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        lastname: { type: String },
        age: { type: Number },
        nif: { type: String },
        companyName: { type: String },
        cif: { type: String },
        address: { type: String },
        isAutonomo: { type: Boolean, default: false },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true, select: false },
        resetToken: { type: String },
        resetTokenExpires: { type: Date },
        role: {
            type: String,
            enum: ["user", "admin", "guest", "autonomo"], // es el enum de SQL
            default: "user"
        },
        verificationCode: { type: String },
        attempts: { type: Number, default: 3 },
        status: { type: String, enum: ["pending", "verified", "blocked"], default: "pending" }
    },
    {
        timestamps: true,
        versionKey: false
    }
);

UserSchema.plugin(mongooseDelete, { overrideMethods: "all", deletedAt: true });
module.exports = mongoose.model("users", UserSchema);
