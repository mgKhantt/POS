const Admin = require("../../models/Admins");
const User = require("../../models/Users");

const getAdminHomePage = (req, res) => {
    const admin = req.session.admin;
    res.render("admin/adminHomePage", {
        layout: "./layouts/adminApp",
        docTitle: "Admin Home",
        pageTitle: "Welcome to the Admin Dashboard",
        admin: admin,
        page: "adminHome",
    });
};

const getCreateAdminPage = (req, res) => {
    res.render("admin/createAdmin", {
        layout: "./layouts/adminApp",
        docTitle: "Create Admin",
        pageTitle: "Create New Admin Account",
        user: req.session.user,
        page: "createAdmin",
    });
};

const postCreateAdminPage = async (req, res) => {
    try {
        const { username, email, password, role } = req.body;

        if (!username || !email || !password) {
            return res
                .status(400)
                .json({ error: "Username, email and password are required" });
        }

        // Check duplicates
        const existingUser = await User.findOne({ email });
        const existingAdmin = await Admin.findOne({ email });

        if (existingUser || existingAdmin) {
            return res.status(400).json({ error: "Email already exists" });
        }

        // Only save date (no time)
        const today = new Date();
        const onlyDate = new Date(
            today.getFullYear(),
            today.getMonth(),
            today.getDate()
        );

        // 1️⃣ Save User
        const newUser = new User({
            name: username,
            email,
            password,
            role,
            createdAt: onlyDate,
            updatedAt: onlyDate,
        });
        const savedUser = await newUser.save();
        // console.log("Saved User:", savedUser);

        // 2️⃣ Save Admin
        const newAdmin = new Admin({
            username,
            email,
            password,
            role,
            userRef: savedUser._id,
            createdAt: onlyDate,
            updatedAt: onlyDate,
        });
        const savedAdmin = await newAdmin.save();
        // console.log("Saved Admin:", savedAdmin);

        // 3️⃣ Update user to reference admin
        savedUser.adminRef = savedAdmin._id;
        await savedUser.save();

        res.redirect("/admin/users");
    } catch (error) {
        console.error(error);
        res.status(400).json({ error: error.message });
    }
};

exports.getAdminHomePage = getAdminHomePage;
exports.getCreateAdminPage = getCreateAdminPage;
exports.postCreateAdminPage = postCreateAdminPage;
