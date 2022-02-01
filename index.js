const fs = require("fs");
const express = require("express");
const pathLib = require("path");
// 创建 application/x-www-form-urlencoded 编码解析
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({
    extended: false
})
// 创建文件解析
const multer = require('multer')

const app = express();

// app.use('/public', express.static('public'));
app.use(bodyParser.urlencoded({
    extended: false
}));
const avatorMulter = multer({
    dest: './avator/'
}).any();

const soundMulter = multer({
    dest: "./sound/"
}).any()


app.get('/queryId', function (req, res) {
    fs.readFile(`./database/${req.query.id}.json`, (err, data) => {
        if (!err) {
            var queryMeMeRen = JSON.parse(data.toString());
            res.send({
                data: queryMeMeRen,
                errorCode: 0,
            });
            fs.close()
        } else {
            res.send({
                "errorCode": 1,
                "errorMessage": "无法查询到此ID，请问琛琛重新要一个网址"
            })
        }
    })
});

app.post('/addMeMeRen', function (req, res) {
    var body = req.body;
    if (body && body.id) {
        if (checkIdVaild(body.id)) {
            fs.writeFile(`./database/${body.id}.json`, JSON.stringify(body), err => {
                if (err) {
                    res.send({
                        "errorCode": -1,
                        "errorMessage": err.message
                    })
                } else {
                    res.send({
                        errorCode: 0,
                        errorMessage: "保存成功"
                    })
                }
            })
        } else {
            res.send({
                "errorCode": 1,
                "errorMessage": "不存在该条记录，请确认网址完整性"
            })
        }
    } else {
        res.send({
            "errorCode": 1,
            "errorMessage": "id参数缺失"
        })
    }
});

app.post('/uploadAvator', avatorMulter, function (req, res, next) {
    var newName = req.files[0].path + pathLib.parse(req.files[0].originalname).ext;
    /**
     * fs 属性 rename 参数1：被改的文件， 参数2：需要更改的名称 ， 参数3：回调函数function(err){}
     */
    fs.rename(req.files[0].path, newName, function (err) {
        if (err)
            res.send({
                errorCode: 1,
                errorMessage: "上传失败"
            });
        else
            res.send({
                errorCode: 0,
                data: {
                    message: "上传成功",
                    filename: newName.replace(/^avator\\/, "")
                }
            });
    });
});

app.post('/uploadSound', soundMulter, function (req, res, next) {
    var newName = req.files[0].path + pathLib.parse(req.files[0].originalname).ext;
    /**
     * fs 属性 rename 参数1：被改的文件， 参数2：需要更改的名称 ， 参数3：回调函数function(err){}
     */
    fs.rename(req.files[0].path, newName, function (err) {
        if (err)
            res.send({
                errorCode: 1,
                errorMessage: "上传失败"
            });
        else
            res.send({
                errorCode: 0,
                data: {
                    message: "上传成功",
                    filename: newName.replace(/^avator\\/, "")
                }
            });
    });
})

function checkIdVaild(id) {
    try {
        fs.readFileSync(`./database/${id}.json`);
        return true
    } catch {
        return false;
    }
}

var server = app.listen(8081, function () {

    var host = server.address().address
    var port = server.address().port

    console.log(host)
    console.log(port)

    console.log("应用实例，访问地址为 http://%s:%s", host, port)

})