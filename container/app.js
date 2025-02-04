let http = require('http');
// let url = require('url');
Port = 8080;
AccessLogFormat = 'Apache';

function logHttpRequest(req, httpStatus) {
    let headers = req.headers;
    // console.dir(req);
    // console.dir(req.headers);
    // console.log('--- Request: ---')
    // console.log(req);
    // console.log('--- Response: ---');

    let user = '-' ;
    if ((headers['sec-fetch-user'] != '?1') && (headers['sec-fetch-user'] != 'none') && (headers['sec-fetch-user'] != null)) {
        user = headers['sec-fetch-user'];
    }

    let time = '[time?]';
    let firstLineOfRequest = `"${req.method} ${req.path} HTTP/${req.httpVersion}"`;
    let responseSizeBytes = '-';
    
    let referer = '"-"';
    if (headers.referer != null) {
        referer = headers.referer;
    }

    if(AccessLogFormat == 'Apache') {
        console.log(`${headers.host} ${user} ${time} ${firstLineOfRequest} ${httpStatus} ${responseSizeBytes} ${headers['user-agent']}`);
    }
}


http.createServer(function (req, res) {
    if (req.method == 'GET' && req.url == '/') {
        httpStatus = 200;
        logHttpRequest(req, httpStatus);
        res.writeHead(httpStatus, {'Content-Type': 'text/html'});
        res.write('Get recieved');
        res.end();

    } else if (req.method == 'POST' && req.url == '/') {
        httpStatus = 200;
        logHttpRequest(req, httpStatus);
        res.writeHead(httpStatus, {'Content-Type': 'text/html'});
        res.write('Post recieved');
        res.end();
        
    } else {
        res.writeHead(404, {'Content-Type': 'text/html'});
        res.write("HTTP 404, Not Found.");
        res.end();
    }
}).listen(Port);
