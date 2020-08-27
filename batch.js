const pgsql = require("pg");
const async = require('async');

const dbconection = new pgsql.Pool({
//database connection
connectionString: "postgres://userdb:passdb@localhost:5432/dbname"
});
/**
 * This function we can get time of our process
 * @param {Date} start_date Date when start the process
 * @param {Date} end_date Date when finish the process
 */
const showDiff = (start_date,end_date) =>{
    let diff = (end_date - start_date)/1000;
    diff = Math.abs(Math.floor(diff));
    let years = Math.floor(diff/(365*24*60*60));
    let leftSec = diff - years * 365*24*60*60;
    let month = Math.floor(leftSec/((365/12)*24*60*60));
    leftSec = leftSec - month * (365/12)*24*60*60;
    let days = Math.floor(leftSec/(24*60*60));
    leftSec = leftSec - days * 24*60*60;
    let hrs = Math.floor(leftSec/(60*60));
    leftSec = leftSec - hrs * 60*60;
    let min = Math.floor(leftSec/(60));
    leftSec = leftSec - min * 60;
    console.log("process finished in " + years + " years "+ month + " month " + days + " days " + hrs + " hours " + min + " minutes and " + leftSec+ ' seconds.');
}

/**
 * Third function called by batch()
 * @param {number} id URI(Uniform Resource Identifier) for update the record
 */
const process = (id,eventBatch) => {
    var sqlstring = 'UPDATE public.test SET is_processed=$2, eventbatch=$3 WHERE id=$1';
    var sqlparams = [id,1,eventBatch];//1=processed
    return function (cb){
        dbconection.query(sqlstring,sqlparams,function (err, result) {
            if(err)
            cb(err);
            else
            cb();
        });
    }
}

/**
 * Second function called, get batchsize records and then parallelLimit processes in parallel by calling the function process()  
 * @param {number} batchsize the number of records need to be processed
 * @param {number} parallelLimit the max number of processes run in parallel
 * @param {number} eventBatch batch number of process
 */
const batch = (batchsize, parallelLimit,eventBatch) => {
    var selectsql = 'SELECT t.id FROM public.test t WHERE t.is_processed=$1 LIMIT $2';
    var selectsqlparams = [0,batchsize];//0=no processed
    return function (cb) {
        var tasks = [];
        dbconection.query(selectsql,selectsqlparams,function (err, result) {
            if (err) {
                console.log("Error: ", err);
                cb(err);
            }else{
                //pushing each process onto the tasks list
                for(let array of result.rows){
                    tasks.push(process(array.id,eventBatch));
                }
                //run each process from the tasks list in series
                async.parallelLimit(tasks, parallelLimit, function (err, result_async) {
                    if (err) {
                        console.log("Error: ", err);
                        cb(err);
                    } else {
                        //Get the number of processed records
                        var statussql = 'SELECT COUNT(t.*) AS count FROM public.test t WHERE t.is_processed=$1';
                        var statussqlparams = [1];//1=processed
                        dbconection.query(statussql,statussqlparams,function (err, result) {
                            if (err) {
                                cb(err);
                            }
                            console.log(result.rows[0].count + " rows processed!");
                            cb();
                        });
                    }
                });
            }
        });
    }
}

/**
 * First function, divide the total number of records into N batches of each batch containing batchsize records
 *  put each batch in an array of tasks list, and each one is processed in series in the async.series
 * @param {number} batchsize required param, the max number of records can have in a batch
 * @param {number} parallelLimit the max number of processes run in parallel
 */
const run = (batchsize, parallelLimit) => {
    const startBatches = (total) => {
        var tasks = [];
        console.log(total, " rows to process.");
        for(var eventBatch=0; eventBatch<total; eventBatch+=batchsize) {
            //pushing each batch into the tasks list
            tasks.push(batch(batchsize, parallelLimit,eventBatch));
        }
        //run each batch from the tasks list in series
        async.series(tasks, function (err, results) {
            if(err) console.log("Done! Error: ", err);
            dbconection.end();
            let date_end = new Date();
            gettimestamp(date_end,'end: ');
            showDiff(start_date,date_end);
        });
    }
    var sqlstring = 'SELECT COUNT(t.*) AS count FROM public.test t WHERE t.is_processed=$1';
    var sqlparams = [0];
    dbconection.query(sqlstring, sqlparams, function (err, result) {
        if (err) {
            console.log("Error1: ", err);
        }else{
            startBatches(result.rows[0].count);
        }
    });
}
const gettimestamp = (date,label_status) => {
    let current_datetime = date
    let formatted_date = (current_datetime.getMonth() + 1) + "/" +current_datetime.getDate() + "/" +  current_datetime.getFullYear() +' '+ current_datetime.getHours() + ":" + current_datetime.getMinutes() + ":" + current_datetime.getSeconds()
    console.log(label_status+formatted_date)
}
var start_date = new Date();
gettimestamp(start_date,'start: ');

run(1000, 100);