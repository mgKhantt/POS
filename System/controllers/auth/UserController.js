const User = require("../../models/Users")
const express = require("express")

const createUser = async (req, res) => {
    try {
        const user = new User(req.body);
        await user.save();
        res.status(201).json({ message: "User created successfully", user });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

const getUsers = async (req, res) => {
    try {
        const users = await User.find()
        res.json(users)
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
        if (!user) return res.status(404).json({ message: "User not found" })
        res.json(user)
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const deleteUser = async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id)
        res.json({ message: "User deleted successfully" })
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const updateUser = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        )
        if (!user) return res.status(404).json({ message: "User not found" })
        res.json({ message: "User updated successfully", user })
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

exports.createUser = createUser
exports.getUsers = getUsers
exports.getUserById = getUserById
exports.deleteUser = deleteUser
exports.updateUser = updateUser
