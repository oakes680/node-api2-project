const express = require("express");

const Posts = require("../data/db");

const router = express.Router();

router.get("/", (req, res) => {
    Posts.find()
        .then(post => {
            res.status(200).json(post);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                errorMessage: "The posts information could not be retrieved."
            });
        });
});

router.get("/:id", (req, res) => {
    const { id } = req.params;
    Posts.findById(id)
        .then(post => {
            console.log(id)
            console.log(post)
            if (post) {
                res.status(200).json(post);
            } else {
                res
                    .status(404)
                    .json({ message: "The post with the specified ID does not exist." });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                message: "The post with the specified ID does not exist."
            });
        });
});

router.get("/:id/comments", (req, res) => {
    const { id } = req.params;
    Posts.findCommentById(id)
        .then(post => {
            console.log(id)
            console.log(post[0])
            if (!post[0]) {
                res
                    .status(404)
                    .json({ message: "The post with the specified ID does not exist." });
            } else {
                res.status(200).json(post);
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                errorMessage: "RIP Homie."
            });
        });
});



router.post('/', (req, res) => {
    if (!req.body.title || !req.body.contents) {
        res
            .status(400)
            .json({ errorMessage: "Please provide title and contents for the post." });
    } else {

        Posts.insert(req.body)
            .then(post => {
                res.status(201).json(res.body)
            })
            .catch(err => {
                console.log(err)
                res.status(500).json({
                    error: "There was an error while saving the post to the database"
                })
            })

    }
})






        router.delete('/:id', (req, res) => {
            Posts.remove(req.params.id)
                .then(post => {
                    if (post) {
                        res.status(200).json({ message: 'The Post has been deleted' });
                    } else {
                        res.status(404).json({ message: "The post with the specified ID does not exist." });
                    }
                })
                .catch(error => {
                    // log error to database
                    console.log(error);
                    res.status(500).json({
                        error: "The post could not be removed",
                    });
                });
        });



        router.put('/:id', (req, res) => {

            if (!req.body.title || !req.body.contents) {
                res.status(400).json({ errorMessage: "Please provide title and contents for the post." })
            } else {

                Posts.update(req.params.id, req.body)
                    .then(post => {
                        if (post) {
                            res.status(200).json(req.body);
                        } else {
                            res.status(404).json({ message: "The post with the specified ID does not exist" })
                        }

                    })
                    .catch(error => {
                        console.log(error)
                        res.status(500).json({
                            message: 'Error updating the post'
                        })
                    })
            }
        })




        router.post("/:id/comments", (req, res) => {
            const { id } = req.params;
            const { text } = req.body;
            const comment = {...req.body, post_id: id};
            if (!text) {
              res
                .status(400)
                .json({ errorMessage: "Please provide text for the comment." });
            } else {
              Posts.findById(id)
                .then(post => {
                  if (!post.length) {
                    res
                      .status(404)
                      .json({
                        message: "The post with the specified ID does not exist."
                      });
                  } else {
                    Posts.insertComment(comment)
                      .then(comment => {
                        res.status(201).json(comment);
                      })
                      .catch(error => {
                        res
                          .status(500)
                          .json({
                            error:
                              "There was an error while saving the comment to the database"
                          });
                      });
                  }
                })
                .catch(error => {
                  res.status(500).json(error);
                });
            }
          });


        module.exports = router;
