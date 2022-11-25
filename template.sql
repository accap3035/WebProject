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