const getHomePage = (req, res) => {
    res.render("client/homePage", {
        docTitle: "Home Page",
        pageTitle: "Welcome to the Home Page",
        user: req.session.user
    })
}

exports.getHomePage = getHomePage;