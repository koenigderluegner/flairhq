/* global module, Application, User, Reddit */
var reddit = require('redwrap');


module.exports = {

  apply: function (req, res) {
    if (!req.user) {
      return res.json("Not logged in", 403);
    }

    var appData = {
      user: req.user.name,
      flair: req.allParams().flair,
      sub: req.allParams().sub
    };

    Application.find(appData).exec(function (err, app) {
      if (err) {
        return res.json({error: err}, 500)
      }
      if (app.length > 0) {
        return res.json({error: "Application already exists"}, 400)
      }
      Application.create(appData).exec(function (err, apps) {
        if (err) {
          return res.json({error: err}, 500);
        }
        if (apps) {
          return res.json(apps, 200);
        }
      });
    });
  },

  denyApp: function (req, res) {
    if (!req.user || !req.user.isMod) {
      return res.json("Not a mod", 403);
    }

    Application.destroy({id: req.allParams().id}).exec(function (err, app) {
      if (err) {
        return res.json(err, 500);
      }
      return res.json(app, 200);
    });
  },

  approveApp: function (req, res) {
    if (!req.user || !req.user.isMod) {
      return res.json("Not a mod", 403);
    }
    var appId = req.allParams().id;

    Application.findOne(appId).exec(function (err, app) {
      if (!app) {
        return res.json("Application not found.", 404);
      }
      User.findOne({name: app.user}).exec(function (err, user) {
        if (err) {
          return res.json(err, 500);
        }
        var flair,
            css_class;
        if (app.sub === "pokemontrades" && user.flair.ptrades) {
          flair = user.flair.ptrades.flair_text;
          css_class = user.flair.ptrades.flair_css_class;
        } else if (app.sub === "svexchange" && user.flair.svex) {
          flair = user.flair.svex.flair_text;
          css_class = user.flair.svex.flair_css_class;
        }
        if (css_class && css_class.slice(-1) === "2") {
          app.flair += "2";
        }
        if (css_class && css_class.indexOf(' ') > -1) {
          if (app.flair.indexOf('ribbon')) {
            css_class = css_class.substr(0, css_class.indexOf(' ')) + " " + app.flair;
          } else {
            css_class = app.flair + " " + css_class.substr(css_class.indexOf(' ') + 1);
          }
        } else {
          if (app.flair.indexOf('ribbon') > -1 && css_class && css_class.indexOf('ribbon') === -1) {
            css_class = css_class + app.flair;
          } else if (app.flair.indexOf('ribbon') === -1 && css_class && css_class.indexOf('ribbon') > -1) {
            css_class = app.flair + css_class;
          } else {
            css_class = app.flair;
          }
        }

        Reddit.setFlair(
          req.user.redToken,
          user.name,
          css_class,
          flair,
          app.sub, function (err, css_class) {
          if (err) {
            return res.json(err, 500);
          } else {
            console.log("Changed " + user.name + "'s flair to " + css_class);
            Application.destroy({id: req.allParams().id}).exec(function (err, app) {
              if (err) {
                return res.json(err, 500);
              }
              return res.json(app, 200);
            });
          }
        });
      });
    });
  },

  getApps: function (req, res) {
    if (!req.user || !req.user.isMod) {
      return res.json("Not a mod", 403);
    }

    Application.find().exec(function (err, apps) {
      res.json(apps, 200);
    });
  }
};

