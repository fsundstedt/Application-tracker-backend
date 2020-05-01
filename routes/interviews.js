const express = require("express");
const router = express.Router();
const Interviews = require("../Models/interviews.js");

router.get("/:application_id?", async function (req, res) {
  const { application_id } = req.params;

  let data = await Interviews.getInterviews(application_id);
  res.json(data);
});

module.exports = router;
