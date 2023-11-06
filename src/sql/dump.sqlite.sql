-- TABLE
CREATE TABLE `projects` (
  `fileid` integer NOT NULL PRIMARY KEY AUTOINCREMENT,
  `userid` integer NOT NULL,
  `projectname` varchar(32) NOT NULL,
  `project` longtext NOT NULL
);
CREATE TABLE `shared_projects` (
  `code` integer NOT NULL PRIMARY KEY AUTOINCREMENT,
  `time` datetime NOT NULL DEFAULT (datetime()),
  `project` longtext NOT NULL
);
CREATE TABLE sqlite_sequence(name,seq);
CREATE TABLE users(
  `id` integer NOT NULL PRIMARY KEY AUTOINCREMENT,
  `username` varchar(32) NOT NULL,
  `password` varchar(32) NOT NULL,
  `admin` integer NOT NULL
);
CREATE TABLE tutorials(
  `name` varchar(32) NOT NULL PRIMARY KEY,
  `tutorialdata` longtext NOT NULL
);
 
-- INDEX
 
-- TRIGGER
 
-- VIEW