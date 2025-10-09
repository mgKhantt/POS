const jwt = require("jsonwebtoken");
const Admin = require("../models/Admins");
const User = require("../models/Users");
const SECRET_KEY = process.env.SECRET_KEY || "POS";

const authMiddleware = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.redirect("/login");
    }

    try {
        const decoded = jwt.verify(token, SECRET_KEY);

        // Only allow clients here
        if (decoded.role !== "client") {
            return res.redirect("/login");
        }

        req.user = decoded;
        res.locals.username = decoded.name; // username for navbar
        res.locals.page = req.path.split('/')[1] || 'home';
        next();
    } catch (err) {
        console.error("User error:", err);
        res.clearCookie("token");
        return res.redirect("/login");
    }
};


const authAdminMiddleware = async (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.redirect("/admin/login");
    }

    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        const admin = await Admin.findById(decoded.id);
        if (!admin) {
            res.clearCookie("token");
            return res.redirect("/admin/login");
        }

        req.admin = decoded;
        res.locals.adminName = decoded.username || decoded.name;
        res.locals.page = req.path.split('/')[1] || 'dashboard';
        next();
    } catch (err) {
        console.error(err);
        console.error("Admin auth error:", err);
        res.clearCookie("token");
        return res.redirect("/admin/login");
    }
};

exports.authMiddleware = authMiddleware
exports.authAdminMiddleware = authAdminMiddleware
