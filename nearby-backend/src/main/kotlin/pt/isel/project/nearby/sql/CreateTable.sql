DROP TABLE IF EXISTS Comments;
DROP TABLE IF EXISTS TOKEN;
DROP TABLE IF EXISTS Location;
DROP TABLE IF EXISTS Client;


create table Client
(
    id       serial primary key,
    email    varchar(30) not null,
    username varchar(30) not null unique,
    password varchar(30) not null
);

create table TOKEN
(
    token  VARCHAR(256) primary key,
    userID int references Client (id)
);

CREATE TABLE Location
(
    id           serial PRIMARY KEY,
    lat          double precision NOT NULL,
    lng          double precision NOT NULL,
    name         varchar(255)     NOT NULL,
    searchRadius double precision NOT NULL,
    userId       int,
    CONSTRAINT fk_user FOREIGN KEY (userId) REFERENCES Client (id)
);

CREATE TABLE Comments
(
    id          SERIAL PRIMARY KEY,
    user_id     INTEGER      NOT NULL REFERENCES Client (id) ON DELETE CASCADE,
    location_id INTEGER      NOT NULL REFERENCES Location (id) ON DELETE CASCADE,
    place_name  VARCHAR(255) NOT NULL,
    content     TEXT         NOT NULL,
    created_at  TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT check_content_not_empty CHECK (TRIM(content) != '')
);


SELECT *
from Location;

select *
from Client;

delete from Client where id = 4;


select *
from Comments;

select * from token;


