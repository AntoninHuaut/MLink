CREATE TABLE if not exists game(idGame int auto_increment, guildId VARCHAR(64), nameGame VARCHAR(255), creatorId VARCHAR(64) NOT NULL, roleId VARCHAR(255), CONSTRAINT game_pk PRIMARY KEY(idGame));

CREATE TABLE if not exists link(idGame INT, userId VARCHAR(50), pseudo VARCHAR(255) NOT NULL, CONSTRAINT link_pk PRIMARY KEY(idGame, userId), FOREIGN KEY link_fk (idGame) REFERENCES game(idGame));
