const express = require('express');
const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    const SECRET_KEY = process.env.SECRET_KEY
    const token = req.cookies.token;
    // if (!token) {
    //     return res.redirect('/login');
    // }

    if (!req.session.user) {
        return res.redirect('/login');
    }
    next();
    // jwt.verify(token, SECRET_KEY, (err, decoded) => {
    //     if (err) {
    //         return res.redirect('/login');
    //     }
    //     req.user = decoded;
    //     req.session.user = req.data.user;
    //     next();
    // })
}

const authAdminMiddleware = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.redirect('/admin/login'); // Redirect to admin login page if token is not found
    }
    
    const userEmail = token
    const User = require('../models/User');
    User.findOne({ email: userEmail}, (err, user) => {
        if (err || !user) return res.redirect('/admin/login');
        if (user.role !== 'admin') return res.status(403).json({ message: 'Access denied' });
        next();
    })
}

const userName = (req, res, next) => {
    res.locals.userName = req.session.user ? req.session.user.name : null;
    res.locals.page = req.path.split('/')[1] || 'home';
    next();
}

exports.authMiddleware = authMiddleware;
exports.authAdminMiddleware = authAdminMiddleware;
exports.userName = userName;