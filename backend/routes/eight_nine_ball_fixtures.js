var express = require("express");
var router = express.Router();
const _ = require("lodash");
const Joi = require("joi");
const knex = require("../db/knex");
const auth = require("../auth");

const eight_nine_ball_leagues = require("../models/eight_nine_ball_leagues");
const eight_nine_ball_fixtures = require("../models/eight_nine_ball_fixtures");

const score = require("../functions/score");
const fixture_split = require("../functions/polygonshuffle");
const fixturegen = require("../functions/fixturegen");
/* 
  GET handler for /api/89_ball_fixture
  Function: To get all the fixtures of the specified type
*/
router.get("/", (req, res) => {
  req.query.type = parseInt(req.query.type, 10);
  const schema = {
    type: Joi.number()
      .integer()
      .required()
  };

  //Validation
  if (Joi.validate(req.query, schema, { convert: false }).error) {
    res.status(400).json({ status: "error", error: "Invalid data" });
    return;
  }
  eight_nine_ball_fixtures
    .query()
    .where({ type: req.query.type })
    .then(
      fixture => {
        res.json(fixture);
      },
      e => {
        res.status(400).json(e);
      }
    );
});

/* 
  GET handler for /api/89_ball_fixture/group/:seasonId
  Function: To get the number of distinct group
*/
router.get("/group/:seasonId", (req, res) => {
  req.query.type = parseInt(req.query.type, 10);
  const schema = {
    type: Joi.number()
      .integer()
      .required()
  };

  //Validation
  if (Joi.validate(req.query, schema, { convert: false }).error) {
    res.status(400).json({ status: "error", error: "Invalid data" });
    return;
  }

  let seasonId = parseInt(req.params.seasonId, 10);

  eight_nine_ball_fixtures
    .query()
    .where({ type: req.query.type, seasonId: seasonId })
    .countDistinct("group as count")
    .then(
      count => {
        res.json(count);
      },
      e => {
        res.status(400).send();
      }
    );
});

/* 
  GET handler for /api/89_ball_fixture/due/:staffName
  Function: To get all the fixtures unplayed by a user. Caps sensitive.
  TODO: FUNCTIONALITY NOT FINISHED
*/
router.get("/due/:staffName", (req, res) => {
  req.query.type = parseInt(req.query.type, 10);
  const schema = {
    type: Joi.number()
      .integer()
      .required()
  };

  //Validation
  if (Joi.validate(req.query, schema, { convert: false }).error) {
    res.status(400).json({ status: "error", error: "Invalid data" });
    return;
  }

  let staffName = req.params.staffName;
  eight_nine_ball_fixtures
    .query()
    .where({ score1: null })
    .where({ player1: staffName })
    .orWhere({ player2: staffName })
    .then(
      fixture => {
        if (!fixture.length) {
          res.status(404).send();
        } else {
          res.send(fixture);
        }
      },
      e => {
        res.status(500).json(e);
      }
    );
});

/* 
  GET handler for /api/89ball_fixture/unplayed/:seasonId
  Function: To get all the fixtures unplayed in a season.
*/
router.get("/unplayed/:seasonId", (req, res) => {
  req.query.type = parseInt(req.query.type, 10);
  const schema = {
    type: Joi.number()
      .integer()
      .required()
  };

    //Validation
    if (Joi.validate(req.query, schema, { convert: false }).error) {
      res.status(400).json({ status: "error", error: "Invalid data" });
      return;
    }

  let seasonId = parseInt(req.params.seasonId);
  eight_nine_ball_fixtures
    .query()
    .where({type: req.query.type, seasonId: seasonId, score1: null, score2: null })
    .orderBy("player1", "asc")
    .then(
      fixture => {
          res.send(fixture);
      },
      e => {
        res.status(500).json(e);
      }
    );
});

/* 
  GET handler for /api/89ball_fixture/due/:staffName
  Function: To get all the fixtures unplayed by a user in a season. Caps sensitive.
*/
router.get("/unplayed/:seasonId/:staffName", (req, res) => { //fix urls
  let seasonId = parseInt(req.params.seasonId);
  let staffName = req.params.staffName;
  eight_ball_fixtures
    .query()
    .where({ seasonId: seasonId })
    .where({ score1: null })
    .where({player1: staffName})
    .orWhere({player2: staffName})
    .orderBy("player1", "asc")
    .then(
      fixture => {
        if (!fixture.length) {
          res.status(404).send();
        } else {
          res.send(fixture);
        }
      },
      e => {
        res.status(500).json(e);
      }
    );
});

/* 
  GET handler for /api/89_ball_fixture/:seasonId
  Function: To get all the fixtures in the specified season
*/
router.get("/:seasonId", (req, res) => {
  req.query.type = parseInt(req.query.type, 10);
  const schema = {
    type: Joi.number()
      .integer()
      .required()
  };

  //Validation
  if (Joi.validate(req.query, schema, { convert: false }).error) {
    res.status(400).json({ status: "error", error: "Invalid data" });
    return;
  }

  let seasonId = parseInt(req.params.seasonId, 10);

  eight_nine_ball_fixtures
    .query()
    .where({ type: req.query.type, seasonId: seasonId })
    .then(
      fixture => {
        if (!fixture.length) {
          res.status(404).send();
        } else {
          res.send(fixture);
        }
      },
      e => {
        res.status(500).json(e);
      }
    );
});

/* 
  GET handler for /api/89_ball_fixture/:seasonId/:staffName
  Function: To get all the fixtures in the specified season for specified player
*/
router.get("/:seasonId/:staffName", (req, res) => {
  req.query.type = parseInt(req.query.type, 10);
  const schema = {
    type: Joi.number()
      .integer()
      .required()
  };

  //Validation
  if (Joi.validate(req.query, schema, { convert: false }).error) {
    res.status(400).json({ status: "error", error: "Invalid data" });
    return;
  }

  let seasonId = parseInt(req.params.seasonId, 10);
  let staffName = req.params.staffName;

  eight_nine_ball_fixtures
    .query()
    .where({ type: req.query.type, seasonId: seasonId, player1: staffName })
    .orWhere({ type: req.query.type, seasonId: seasonId, player2: staffName })
    .then(
      fixture => {
        if (!fixture.length) {
          res.status(404).send();
        } else {
          res.send(fixture);
        }
      },
      e => {
        res.status(500).json(e);
      }
    );
});

/* 
  PUT handler for /api/89ball_fixture/edit/
  Function: To update the score
*/
router.put("/edit",auth.checkJwt, async (req, res) => {
  const schema = {
    type: Joi.number()
      .integer()
      .required(),
    seasonId: Joi.number()
      .integer()
      .required(),
    player1: Joi.string().required(),
    score1: Joi.number().required(),
    player2: Joi.string().required(),
    score2: Joi.number().required()
  };

  if (Joi.validate(req.body, schema, { convert: false }).error) {
    res.status(400).json({ status: "error", error: "Invalid data" });
    return;
  }

  const leagueAttributes = {
    type: req.body.type,
    seasonId: req.body.seasonId,
    player1: req.body.player1,
    score1: null,
    player2: req.body.player2,
    score2: null
  };

  const p1Attributes = {
    type: req.body.type,
    seasonId: req.body.seasonId,
    staffName: req.body.player1
  };

  const p2Attributes = {
    type: req.body.type,
    seasonId: req.body.seasonId,
    staffName: req.body.player2
  };

  //Check if fixture exist and score is still null (means fixture hasnt been played)
  try {
    let fixture = await eight_nine_ball_fixtures
      .query()
      .findOne(leagueAttributes);

    if (!fixture) {
      res.status(404).send();
      return;
    }
  } catch (e) {
    res.status(500).send();
  }

  let player1;
  let player2;

  //Fetch player1
  try {
    player1 = await eight_nine_ball_leagues.query().findOne(p1Attributes);
    if (!player1) {
      res.status(404).send();
      return;
    }
  } catch (e) {
    res.status(500).send();
    return;
  }

  //Fetch player2
  try {
    player2 = await eight_nine_ball_leagues.query().findOne(p2Attributes);
    if (!player2) {
      res.status(404).send();
      return;
    }
  } catch (e) {
    res.status(500).send();
    return;
  }

  /* LEAGUE ALGORITHM */
  try {
    const players = score.calculateScore(
      player1,
      player2,
      req.body.score1,
      req.body.score2
    );
    player1 = _.cloneDeep(players.player1);
    player2 = _.cloneDeep(players.player2);
  } catch (e) {
    res.status(500).send();
    return;
  }

  //UPDATE FIXTURE TABLE
  try {
    let result = await eight_nine_ball_fixtures
      .query()
      .findOne(leagueAttributes)
      .patch({
        score1: req.body.score1,
        score2: req.body.score2
      });
    if (result === 0) {
      res.status(404).send();
      return;
    }
  } catch (e) {
    res.status(500).send();
    return;
  }

  //UPDATE PLAYER1 IN LEAGUE TABLE
  try {
    let result = await eight_nine_ball_leagues
      .query()
      .findOne(p1Attributes)
      .patch(player1);
    if (result === 0) {
      res.status(404).send();
      return;
    }
  } catch (e) {
    res.status(500).send();
    return;
  }

  //UPDATE PLAYER2 IN LEAGUE TABLE
  try {
    let result = await eight_nine_ball_leagues
      .query()
      .findOne(p2Attributes)
      .patch(player2);
    if (result === 0) {
      res.status(404).send();
      return;
    }
  } catch (e) {
    res.status(500).send();
    return;
  }

  //EVERYTHING SUCCEED
  res.status(200).send();
});

/* 
  POST handler for /api/89_ball_fixture/generate/. 
  Function: Handles fixture generation and fixture splitting
*/
router.post("/generate",auth.checkJwt, async (req, res) => {
  var group = 0;
  var aesDate = new Date(); 
  aesDate.setDate(aesDate.getDate() + 7);
  let seasonId = req.body.seasonId;
  let type = req.body.type;
  
  //take the seasonid and see if it's acceptable
  const schema = {
    type: Joi.number()
      .integer()
      .required(),
    seasonId: Joi.number()
      .integer()
      .required()
  };

  if (Joi.validate(req.body, schema, { convert: false }).error) {
    res.status(400).json({ status: "error", error: "Invalid data" });
    return;
  }

  //db call to get names
  let players;
  try {
    players = await eight_nine_ball_leagues
      .query()
      .where({ type: type, seasonId: seasonId });
    if (players.length <= 1) {
      res.status(400).send("Not enough players");
      return;
    }
  } catch (e) {
    res.status(500).send();
    return;
  }
  var playerCount = players.length;
  let fixture = [];
  let exCount = 1;
  if (playerCount % 2 > 0) {
    exCount = 0;
  }
  //this gets a fixture and puts it into fixtSets
  for (var j = 0; j < playerCount - exCount; j++) {
    fixture = fixturegen.fixtureCalc(type, players, seasonId, group, aesDate.getTime()); //this represents the fixture rows
    knex.batchInsert("eight_nine_ball_fixtures", fixture, 100).then(
      result => {
        if (result) {
          res.status(200).send();
        }
      },
      e => {
        res.status(400).send();
      }
    );
    group++;
    aesDate.setDate(aesDate.getDate()+7);
    
    players = fixture_split.polygonShuffle(players); //rotate players for next fixture
  }
});

/* 
  POST handler for /api/89ball_fixture/overdue/. 
  Function: Displays list of overdue fixtures.
*/
router.get("/overdue", (req, res) => {
  let currentDate = new Date();
  currentDate = parseInt(currentDate);
  eight_nine_ball_fixtures
    .query()
    .where("date", "!=", currentDate)
    .then(
      fixture => {
        if (!fixture.length) {
          res.status(404).send();
        } else {
          res.send(fixture);
        }
      },
      e => {
        res.status(500).json(e);
      }
    );
});

/* 
  POST handler for /api/89ball_fixture/book/. 
  Function: Books a fixture for a particular date.
*/
router.post("/book",  async (req, res) => {
  console.log("AFASFASFASFSAFSAF")
  req.query.type = parseInt(req.query.type, 10);
  const schema = {
    type: Joi.number()
      .integer()
      .required()
  };
  let name = req.body.name;
  let opponent = req.body.opponent;
  let day = req.body.day;
  let time = req.body.time;
  
  //find the fixture
  const fixt = await eight_nine_ball_fixtures.query().findOne({
      player1: name,
      player2: opponent
  })
  console.log(fixt.date + " date")
  let convDate = new Date(fixt.date) //fixt.date stores the time in milliseconds. this must be stripped to 00:00 of its base day.
  console.log(convDate.toString())
  let oldDay = convDate.toString().split(' ').slice(0,1).join(' ') //stores day from db
  let oldTime = convDate.toString().split(' ').slice(4,5).join(' ') //stores time from db
  console.log("day: " + oldDay + ", time: " + oldTime)

  let hrs = oldTime.split(':').slice(0,1)
  let mins = oldTime.split(':').slice(1,2)
  let secs = oldTime.split(':').slice(2,3)

  let timeDeduct = (parseInt(hrs) * 3600000) + (parseInt(mins) * 60000) + (parseInt(secs) * 1000)
  fixt.date = fixt.date - timeDeduct; //date is now 00:00
  let val = new Date(parseInt(fixt.date)-timeDeduct)
  console.log(val.toString())
  //could take time and just remove
  //then remove days as necessary
  if (oldDay == "Mon") {
    console.log("cool")
  }

  multiplier = 1
  switch(oldDay) {
    case "Mon":
     break;
    case "Tues":
      break;
    case "Weds":
      break;
    case "Thurs":
      break;
    case "Fri":
      break;
    case "Sat":
      break;
    case "Sun":
      break;
  }
});

/* 
  POST handler for /api/89ball_fixture/book/edit. 
  Function: Edit a fixture's booking.
*/
router.get("/book/edit", (req, res) => {
  
});

/* 
  POST handler for /api/89ball_fixture/book/. 
  Function: Remove a fixture booking.
*/
router.get("/book/delete", (req, res) => {
  
});
module.exports = router;
