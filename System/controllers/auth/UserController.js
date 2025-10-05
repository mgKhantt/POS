const moment = require("moment");
const User = require("../../models/Users");
const express = require("express");
const Admin = require("../../models/Admins");

const createUser = async (req, res) => {
    try {
        const user = new User(req.body);
        await user.save();
        res.status(201).json({ message: "User created successfully", user });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const getUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getUserById = async (req, res) => {
    try {
        const admin = await User.findById(req.params.id);
        if (!admin) return res.status(404).json({ message: "User not found" });
        // res.json(user);
        res.render("admin/editAdmin", {
            layout: "./layouts/adminApp",
            docTitle: "Edit User",
            pageTitle: "Edit User Details",
            admin,
            page: "editUser",
        })
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const deleteUser = async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        await Admin.findOneAndDelete({ userRef: req.params.id });
        res.json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateUser = async (req, res) => {
    try {
        // Update user (by _id)
        const user = await User.findByIdAndUpdate(
            req.params.id,
            {
                name: req.body.name,
                email: req.body.email,
                role: req.body.role, // only if role is in User schema
            },
            { new: true, runValidators: true }
        );

        // Update admin (by userRef, not _id)
        const admin = await Admin.findOneAndUpdate(
            { userRef: req.params.id },
            {
                username: req.body.name,
                email: req.body.email,
                role: req.body.role, // only if role is in Admin schema
            },
            { new: true, runValidators: true }
        );

        if (!user && !admin) {
            return res.status(404).json({ message: "User not found" });
        }

        // Redirect back to user list
        res.redirect("/admin/users");
    } catch (error) {
        console.error(error);
        res.status(400).json({ error: error.message });
    }
};


const getUsersWithAdminRole = async (req, res) => {
    try {
        const users = await User.aggregate([
            {
                $lookup: {
                    from: "admins",
                    localField: "adminRef",
                    foreignField: "_id",
                    as: "adminDetails",
                },
            },
            {
                $unwind: {
                    path: "$adminDetails",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $project: {
                    name: 1,
                    email: 1,
                    role: 1,
                    "adminDetails.username": 1,
                    "adminDetails.role": 1,
                    "adminDetails.createdAt": 1,
                },
            },
        ]);

        res.render("admin/userList", {
            layout: "./layouts/adminApp",
            docTitle: "User List",
            pageTitle: "List of Users with Admin Details",
            users,
            page: "userList",
            moment,
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.createUser = createUser;
exports.getUsers = getUsers;
exports.getUserById = getUserById;
exports.deleteUser = deleteUser;
exports.updateUser = updateUser;

exports.getUsersWithAdminRole = getUsersWithAdminRole;
