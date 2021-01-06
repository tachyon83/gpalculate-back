const dbSetting = require('./dbConnectionSettings')

// '%' vs 'localhost'

// need to add superuser into 'user' manually

let sql_createUser =
    `create user if not exists ${dbSetting.user}
    identified by '${dbSetting.password}';`;
let sql_grantPrivileges =
    `grant all privileges on ${dbSetting.database}.* 
    to '${dbSetting.user}'@'%';`;
let sql_flush =
    `flush privileges;`;
let sql_alterUser =
    `alter user ${dbSetting.user} 
    identified with mysql_native_password 
    by '${dbSetting.password}';`;
let sqls1 = sql_createUser + sql_grantPrivileges + sql_flush + sql_alterUser;

let sql_createDB =
    `create database if not exists ${dbSetting.database};`;

let sql_createTable_conversion =
    `create table if not exists 
    ${dbSetting.table_conversion}(
        id int not null auto_increment, 
        A1 decimal(5,2),
        A2 decimal(5,2),
        A3 decimal(5,2),
        B1 decimal(5,2),
        B2 decimal(5,2),
        B3 decimal(5,2),
        C1 decimal(5,2),
        C2 decimal(5,2),
        C3 decimal(5,2),
        D1 decimal(5,2),
        D2 decimal(5,2),
        D3 decimal(5,2),
        F decimal(5,2),
        primary key(id),
        unique key(A1,A2,A3,B1,B2,B3,C1,C2,C3,D1,D2,D3,F)
    );`

let sql_createTable_conversion2 =
    `create table if not exists
    ${dbSetting.table_conversion2}(
        k varchar(5) not null,
        v varchar(5) not null
    );`

let sql_createTable_user =
    `create table if not exists
    ${dbSetting.table_user}(
        id int not null auto_increment,
        name varchar(20) not null,
        email varchar(60) not null unique,
        password varchar(150) not null,
        conversionid int not null,
        help tinyint(1) default 1 not null,
        admin tinyint(1) default 0 not null,
        primary key(id),
        foreign key(conversionid)
        references ${dbSetting.table_conversion}(id) 
        on update cascade 
        on delete cascade
    );`

let sql_createTable_semester =
    `create table if not exists
    ${dbSetting.table_semester}(
        id int not null auto_increment,
        userid int not null,
        year int not null,
        season int not null,
        primary key(id),
        unique key(userid,year,season),
        foreign key(userid)
        references ${dbSetting.table_user}(id)
        on update cascade
        on delete cascade
    );`

let sql_createTable_course =
    `create table if not exists
    ${dbSetting.table_course}(
        id int not null auto_increment,
        semesterid int not null,
        name varchar(30) not null,
        units decimal(5,2),
        grade varchar(5),
        include tinyint(1),
        primary key(id),
        unique key(semesterid,name),
        foreign key(semesterid)
        references ${dbSetting.table_semester}(id)
        on update cascade
        on delete cascade
    );`

let sql_createTable_assessment =
    `create table if not exists
    ${dbSetting.table_assessment}(
        id int not null auto_increment,
        courseid int not null,
        name varchar(30) not null,
        receivedScore decimal(5,2),
        totalScore decimal(5,2),
        weight decimal(5,2),
        primary key(id),
        unique key(courseid,name),
        foreign key(courseid)
        references ${dbSetting.table_course}(id)
        on update cascade
        on delete cascade
    );`

let sql_createTable_announcement =
    `create table if not exists 
    ${dbSetting.table_announcement}(
        id int not null auto_increment,
        expiresOn timestamp,
        message varchar(500) not null,
        primary key(id),
        unique key(expiresOn,message)
    );`

let sql_insert_conversion_1 =
    `insert into ${dbSetting.table_conversion}(A1,A2,A3,B1,B2,B3,C1,C2,C3,D1,D2,D3,F) 
    values(4.3,4.0,3.7,3.3,3.0,2.7,2.3,2.0,1.7,1.3,1.0,0.7,0);`

let sql_insert_conversion_2 =
    `insert into ${dbSetting.table_conversion}(A1,A2,A3,B1,B2,B3,C1,C2,C3,D1,D2,D3,F) 
    values(4.0,4.0,3.7,3.3,3.0,2.7,2.3,2.0,1.7,1.3,1.0,0.7,0);`

let sql_insert_converson2_A1 =
    `insert into ${dbSetting.table_conversion2} 
    values('A1','A+');`

let sql_insert_converson2_A2 =
    `insert into ${dbSetting.table_conversion2} 
    values('A2','A');`

let sql_insert_converson2_A3 =
    `insert into ${dbSetting.table_conversion2} 
    values('A3','A-');`

let sql_insert_converson2_B1 =
    `insert into ${dbSetting.table_conversion2} 
    values('B1','B+');`

let sql_insert_converson2_B2 =
    `insert into ${dbSetting.table_conversion2} 
    values('B2','B');`

let sql_insert_converson2_B3 =
    `insert into ${dbSetting.table_conversion2} 
    values('B3','B-');`

let sql_insert_converson2_C1 =
    `insert into ${dbSetting.table_conversion2} 
    values('C1','C+');`

let sql_insert_converson2_C2 =
    `insert into ${dbSetting.table_conversion2} 
    values('C2','C');`

let sql_insert_converson2_C3 =
    `insert into ${dbSetting.table_conversion2} 
    values('C3','C-');`

let sql_insert_converson2_D1 =
    `insert into ${dbSetting.table_conversion2} 
    values('D1','D+');`

let sql_insert_converson2_D2 =
    `insert into ${dbSetting.table_conversion2} 
    values('D2','D');`

let sql_insert_converson2_D3 =
    `insert into ${dbSetting.table_conversion2} 
    values('D3','D-');`

let sql_insert_converson2_F =
    `insert into ${dbSetting.table_conversion2} 
    values('F','F');`

let sqls2 = sql_createTable_conversion +
    sql_createTable_conversion2 +
    sql_createTable_user +
    sql_createTable_semester +
    sql_createTable_course +
    sql_createTable_assessment +
    sql_createTable_announcement +
    sql_insert_conversion_1 +
    sql_insert_conversion_2 +
    sql_insert_converson2_A1 +
    sql_insert_converson2_A2 +
    sql_insert_converson2_A3 +
    sql_insert_converson2_B1 +
    sql_insert_converson2_B2 +
    sql_insert_converson2_B3 +
    sql_insert_converson2_C1 +
    sql_insert_converson2_C2 +
    sql_insert_converson2_C3 +
    sql_insert_converson2_D1 +
    sql_insert_converson2_D2 +
    sql_insert_converson2_D3 +
    sql_insert_converson2_F

let sql_register =
    `insert into ${dbSetting.table_user}(name,email,password,conversionid) 
    values(?,?,?,?);`

let sql_findByEmail =
    `select * from ${dbSetting.table_user} where email=? limit 1;`

let sql_existByEmail =
    `select count(*) as cnt from ${dbSetting.table_user} where email=?;`

let sql_getNumberFromConversion =
    `select * from ${dbSetting.table_conversion} where id=?;`

let sql_getLetterFromConversion =
    `select * from ${dbSetting.table_conversion2};`

let sql_modifyById =
    `update ${dbSetting.table_user} set name=?,
    email=?,conversionid=? where id = ?;`

let sql_help =
    `update ${dbSetting.table_user} set help=0 
    where id=?;`

let sql_addSemester =
    `insert into ${dbSetting.table_semester}(userId,year,season) 
    select ?,?,? where not exists (select * from ${dbSetting.table_semester} 
    where userid=? and year=? and season=?);`

let sql_deleteSemester =
    `delete from ${dbSetting.table_semester} where id = ?;`

let sql_addCourse =
    `insert into ${dbSetting.table_course}(semesterid,name,units,grade,include) 
    select ?,?,?,?,? where not exists (select * from ${dbSetting.table_course} 
    where semesterid=? and name=? and units=? and grade=? and include=?);`

let sql_modifyCourse =
    `update ${dbSetting.table_course} set semesterid=?, 
    name=?, units=?, grade=?, include=? where id=?;`

let sql_deleteCourse =
    `delete from ${dbSetting.table_course} where id=?;`

let sql_addAssessment =
    `insert into ${dbSetting.table_assessment}(courseid,name,receivedscore,totalscore,weight) 
    select ?,?,?,?,? where not exists (select * from ${dbSetting.table_assessment} 
    where courseid=? and name=? and receivedscore=? and totalscore=? and weight=?);`

let sql_modifyAssessment =
    `update ${dbSetting.table_assessment} set courseid=?, 
    name=?, receivedscore=?, totalscore=?, weight=? where id=?;`

let sql_deleteAssessment =
    `delete from ${dbSetting.table_assessment} where id=?;`

let sql_checkUserIdFromCourse =
    `select userid from ${dbSetting.table_semester} where id=
    (select semesterid from ${dbSetting.table_course} where id=?);`

let sql_detailCourse =
    `select s.id,s.year,s.season,c.name,c.units,c.grade 
    from ${dbSetting.table_course} c left join ${dbSetting.table_semester} s on c.semesterid=s.id 
    where c.id=?;`

let sql_assessmentsByCourse =
    `select id,name,receivedScore,totalScore,weight 
    from ${dbSetting.table_assessment} where courseid=?`

let sql_getConversion =
    `select id from ${dbSetting.table_conversion} order by id asc;`

let sql_getCourses =
    `select name,units,grade,include,id 
    from ${dbSetting.table_course} 
    where semesterid=?;`

let sql_findAllSemesters =
    `select id,year,season 
    from ${dbSetting.table_semester} 
    where userId=? 
    order by 
    year asc,
    season asc;`

let sql_updateInclude =
    `update ${dbSetting.table_course} 
    set include=? where id=?;`

let sql_getAnnouncement =
    `select * from ${dbSetting.table_announcement} 
    where expiresOn>=? order by expiresOn asc;`

let sql_addAnnouncement =
    `insert into ${dbSetting.table_announcement}(
        expiresOn,message
    ) values(?,?);`

let sql_addConversion =
    `insert into ${dbSetting.table_conversion}
    (A1,A2,A3,B1,B2,B3,C1,C2,C3,D1,D2,D3,F) 
    values(?,?,?,?,?,?,?,?,?,?,?,?,?);`

let sql_getUserTotal =
    `select count(*) as cnt from 
    ${dbSetting.table_user} 
    where admin=0;`

let sql_getUserList =
    `select * from 
    ${dbSetting.table_user} 
    where admin=0;`

let sql_deleteUser =
    `delete from 
    ${dbSetting.table_user} 
    where email=?;`


module.exports = {
    initialSetup: sqls1,
    newDB: sql_createDB,
    createDummy: sqls2,
    sql_findByEmail,
    sql_existByEmail,
    sql_register,
    sql_getNumberFromConversion,
    sql_getLetterFromConversion,
    sql_modifyById,
    sql_addSemester,
    sql_deleteSemester,
    sql_addCourse,
    sql_modifyCourse,
    sql_deleteCourse,
    sql_addAssessment,
    sql_modifyAssessment,
    sql_deleteAssessment,
    sql_detailCourse,
    sql_assessmentsByCourse,
    sql_getConversion,
    sql_checkUserIdFromCourse,
    sql_help,
    sql_getCourses,
    sql_findAllSemesters,
    sql_updateInclude,
    sql_getAnnouncement,
    sql_addAnnouncement,
    sql_addConversion,
    sql_getUserTotal,
    sql_getUserList,
    sql_deleteUser,

}