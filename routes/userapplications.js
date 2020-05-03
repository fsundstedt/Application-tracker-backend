const express = require("express");
const router = express.Router();
const addApp = require("../Models/addApp");
const newCompany = require("../Models/company");
const db = require("../Models/conn.js");

router.post("/", async (req, res, next) => {
  const {
    user_id,
    company_name,
    city,
    position,
    position_description,
    application_date,
    offer_extended,
    make_public,
  } = req.body;

  try {
    const response = await db.any(
      "SELECT id FROM companies WHERE company_name = $1",
      [company_name]
    );
    const companyId = response && response[0] && response[0].id;

    if (companyId) {
      const response = await addApp.addApplicationData(
        user_id,
        companyId,
        city,
        position,
        position_description,
        application_date,
        offer_extended,
        make_public
      );

      if (response.command === "INSERT" && response.rowCount >= 1) {
        res.json(200);
      } else {
        res.send("Could not add new user").status(409);
      }
      res.sendStatus(200);
    } else {
      const newComp = await newCompany.addCompany(company_name);
      const response = await db.any(
        "SELECT id FROM companies WHERE company_name = $1",
        [company_name]
      );
      const newCompanyId = response && response[0] && response[0].id;

      const addApplication = await addApp.addApplicationData(
        user_id,
        newCompanyId,
        city,
        position,
        position_description,
        application_date,
        offer_extended,
        make_public
      );
      if (response.command === "INSERT" && response.rowCount >= 1) {
        res.json(200);
      } else {
        res.send("Could not add new user").status(409);
      }
      res.sendStatus(200);
    }
  } catch (err) {
    return err;
  }
  next();
});

module.exports = router;
