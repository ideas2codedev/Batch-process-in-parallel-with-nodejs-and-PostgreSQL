# Batch in parallel process with Nodejs and PostgreSQL

![enter image description here](https://www.ideas2code.io/wp-content/uploads/2020/08/Batch-process-in-parallel-with-nodejs-and-PostgreSQL2.jpg)

Hi! Let's code a parallel process using **Nodejs** and **ProstgreSQL**.  Save time and get the best performance of our server,

## Sponsor

[![enter image description here](https://www.ideas2code.io/wp-content/uploads/2020/10/bar.fw_.png)](http://adf.ly/23757721/www.ideas2code.io)

## Analysis
Let's assume there are **1,000,000** rows in a **postgreSQL** table need to be processed using **nodejs**. 

Each row has a **is_processed** field to indicate if it has been **processed** or not, there is also a field called **evenbatch**, it has to be set with the number or slot of batch in where is processed.


## Goal

 - Divide all records in data slot to process. 
 - Process data with multithreading

## Requirements

 - Node & npm installed (in this project run **node: v10.15.1** & **npm: 6.11.2**)
 - PostgreSQL server (used **10.7** version)
 - GIT or GITHUB

## Installation

**Clone** this repository

    git clone https://github.com/ideas2codeweb/Batch-process-in-parallel-with-nodejs-and-PostgreSQL.git

Move to **root folder** and run:

    npm install
Create a table test in your database, run this script:

    CREATE TABLE public.test (
      id SERIAL NOT NULL,
      is_processed INTEGER DEFAULT 0 NOT NULL,
      eventbatch INTEGER,
      last_update TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
      PRIMARY KEY(id)
    ) 
    WITH (oids = false);
Now, lets insert **1,000,000** rows for process in our batch in the database running the follow script :

    INSERT INTO test(id) SELECT * FROM generate_series(1, 1000000);

## Demo
This image is of my project running and processing 10,000 rows. Creating **batchsize** of 1,000 rows.
![enter image description here](https://res.cloudinary.com/dn5xwgf9p/image/upload/v1570209964/preview_github/previewbatchnodejs_ggvt4u.png)
