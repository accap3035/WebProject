create table if not exists jobs(
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    category TEXT NOT NULL,
    city TEXT not null,
    company_name text not null,
    geo text not null,
    job_board text not null,
    job_description text not null,
    job_title text not null,
    job_type text not null,
    post_date text not null,
    salary_offered text not null,
    state text not null,
    url text not null
);

LOAD DATA  LOCAL INFILE '/home/lowerx/Desktop/WebProject/jobs.csv' INTO TABLE jobs
FIELDS TERMINATED BY ','
ENCLOSED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 LINES
(category,city,company_name,geo,job_board,job_description,job_title,job_type,post_date,salary_offered,state,url);

create table if not exists users (
    id int not null AUTO_INCREMENT PRIMARY KEY,
    name text not null,
    surname text not null,
    email text not null,
    number text not null,
    password text not null
);

create table if not exists saved_jobs(
    id  int not null AUTO_INCREMENT PRIMARY KEY,
    jobID int not null,
    userID int not null,
    CONSTRAINT fk_users
    FOREIGN KEY(userID) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_jobs
    FOREIGN KEY(jobID) REFERENCES jobs(id) ON DELETE CASCADE ON UPDATE CASCADE
);