const express = require("express")
const router = express.Router()
router.get("/", (req, res) => {
 const data = ["hola", "mundo", "storage"]
 res.send({data})
})
module.exports = router
