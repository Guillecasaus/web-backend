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
        role: {
            type: String,
            enum: ["user", "admin"], // es el enum de SQL
            default: "user"
        },
        verificationCode: { type: String, required: true },
        attempts: { type: Number, default: 3 },
        status: { type: String, enum: ["pending", "verified"], default: "pending" }
    },
    {
        timestamps: true,
        versionKey: false
    }
);

UserSchema.plugin(mongooseDelete, { overrideMethods: "all", deletedAt: true });
module.exports = mongoose.model("users", UserSchema);
