"use strict";
const sqlite3 = require("sqlite3").verbose();
class Db {
  constructor(file) {
    this.db = new sqlite3.Database(file);
    //console.log(this.createTable());
  }
  createTable() {
    /*const sql = `
            CREATE TABLE IF NOT EXISTS userAuth (
                id integer PRIMARY KEY, 
                name text, 
                email text UNIQUE, 
                password text)`
        return this.db.run(sql);*/
    const sql = `SELECT * FROM users`;
    return this.db.run(sql);
  }
  selectByUser(username, callback) {
    return this.db.get(
      `SELECT * FROM users WHERE username = ?`,
      [username],
      function(err, row) {
        callback(err, row);
      }
    );
  }
  insertUser(user, callback) {
    return this.db.run(
      "INSERT INTO users (username,password,admin) VALUES (?,?,?)",
      user,
      err => {
        callback(err);
      }
    );
  }
  getProjectsFromUser(projectData, callback) {
    return this.db.all(
      `SELECT projectname, project FROM projects WHERE userid = ?`,
      projectData,
      function(err, row) {
        callback(err, row);
      }
    );
  }
  getProjectsFromUserAndProjectname(projectData, callback) {
    return this.db.all(
      `SELECT projectname, project FROM projects WHERE userid = ? AND projectname = ?`,
      projectData,
      function(err, row) {
        callback(err, row);
      }
    );
  }
  insertProject(projectData, callback) {
    return this.db.run(
      "INSERT INTO projects (userid,projectname,project) VALUES (?,?,?)",
      projectData,
      err => {
        callback(err);
      }
    );
  }
  updateProject(projectData, callback) {
    return this.db.run(
      "UPDATE projects SET project = ? WHERE userid = ? AND projectname = ?",
      projectData,
      err => {
        callback(err);
      }
    );
  }
  deleteProject(projectData, callback) {
    return this.db.run(
      "DELETE FROM projects WHERE userid = ? AND projectname = ?",
      projectData,
      err => {
        callback(err);
      }
    );
  }
  insertSharedProject(projectData, callback) {
    return this.db.run(
      "INSERT INTO shared_projects (project) VALUES (?)",
      projectData,
      function(err) {
        console.log(this.lastID);
        callback(err, this.lastID);
      }
    );
  }
  getSharedProjectFromID(projectID, callback) {
    return this.db.get(
      `SELECT project FROM shared_projects WHERE code = ?`,
      projectID,
      function(err, row) {
        callback(err, row);
      }
    );
  }
  getTutorialsFromName(tutorialData, callback) {
    return this.db.all(
      `SELECT * FROM tutorials WHERE name = ?`,
      tutorialData,
      function(err, row) {
        callback(err, row);
      }
    );
  }
  getTutorials(callback) {
    return this.db.all(`SELECT * FROM tutorials`, [], function(err, row) {
      callback(err, row);
    });
  }
  insertTutorial(tutorialData, callback) {
    return this.db.run(
      "INSERT INTO tutorials (name,tutorialdata) VALUES (?,?)",
      tutorialData,
      err => {
        callback(err);
      }
    );
  }
  updateTutorial(tutorialData, callback) {
    return this.db.run(
      "UPDATE tutorials SET tutorialdata = ? WHERE name = ?",
      tutorialData,
      err => {
        callback(err);
      }
    );
  }
  deleteTutorial(tutorialData, callback) {
    return this.db.run(
      "DELETE FROM tutorials WHERE name = ?",
      tutorialData,
      err => {
        callback(err);
      }
    );
  }
  test(callback) {
    return this.db.all(`SELECT * FROM shared_projects`, [], (err, row) => {
      callback(err, row);
    });
  }
  makeAdmin(callback) {
    return this.db.run(
      `UPDATE users SET admin = 1 WHERE username='admin'`,
      [],
      err => {
        callback(err);
      }
    );
  }
  updatePassword(callback) {
    return this.db.run(
      `UPDATE users SET password = '$2a$08$eaHKKan48bct.Fz/WiwbUezKydstA.Fr8kmdsEZcK7ppEMe2Zd2wa' WHERE username='admin'`, // '101010101' '9N$A*K8e/T+gQyA'
      [],
      err => {
        callback(err);
      }
    );
  }
  changeName(callback) {
    return this.db.run(
      `UPDATE users SET username = 'beheerder' WHERE username='admin'`,
      [],
      err => {
        callback(err);
      }
    );
  }
  deleteOldSharedProjects(callback) {
    return this.db.run(
      `DELETE FROM shared_projects WHERE time < (datetime('now','-1 day'))`,
      [],
      err => {
        callback(err);
      }
    );
  }
  deleteSharedProjects(callback) {
    return this.db.run(`DELETE FROM shared_projects`, [], err => {
      callback(err);
    });
  }
  resetSequence(callback) {
    return this.db.run(
      `DELETE FROM sqlite_sequence WHERE name='shared_projects'`,
      [],
      err => {
        callback(err);
      }
    );
  }
}
module.exports = Db;
