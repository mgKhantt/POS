const User = require("../../models/Users")

const getRegisterPage = (req, res) => {
    res.render("auth/register", {
        docTitle: "Register",
        pageTitle: "Register New Account",
        page: "register"
    })
}

const getLoginPage = (req, res) => {
    res.render("auth/login", {
        docTitle: "Login",
        pageTitle: "Login to Your Account",
        page: "login"
    })
}

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body
        const user = await User.findOne({ email })
        if (!user) return res.status(404).json({ message: "User not found" })
        if (user.password !== password) return res.status(401).json({ message: "Invalid password" })
        // res.json({ message: "Login successful", user })
        req.session.user = { id: user._id, email: user.email, name: user.name, role: user.role }
        // const token = jwt.sign({ id: user._id, email: user.email, name: user.name, role: user.role }, process.env.SECRET_KEY, { expiresIn: '1h' })
        // res.cookie("token", token, { httpOnly: true })
        res.redirect("/")

    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

const logoutUser = (req, res) => {
    req.session.destroy()
    res.clearCookie("token")
    res.redirect("/login")
}

exports.getRegisterPage = getRegisterPage
exports.getLoginPage = getLoginPage
exports.loginUser = loginUser
exports.logoutUser = logoutUser