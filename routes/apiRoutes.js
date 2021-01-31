const router = require("express").Router()
const store = require("../db/store.js")



router.get("/notes", (req, res) => {
    store
        .getNotes()
        .then(function (notes) {
            res.json(notes)
        })
        .catch(function (err) {
            res.status(500).json(err)
        })
});

router.post("/notes", (req, res) => {
   
    store
        .addNotes(req.body)
        .then((notes) => res.json(notes))
        .catch(err => res.status(500).json(err))
})

router.delete("/notes/:id", (req, res) => {
    // this is the delete route 
    store
        .removeNotes(req.params.id)
        .then(function () {
            res.json({ ok: true })
        })
        .catch(function (err) {
            res.status(500).json(err)
        })
});

module.exports=router;

