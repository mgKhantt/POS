const getPage = (req, res) => {
    res.render("client/test", {
        docTitle: "Test Page",
        pageTitle: "This is a Test Page" 
       }
    )
}

exports.getPage = getPage;