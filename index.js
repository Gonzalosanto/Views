const { JSDOM } = require('jsdom');
const requireFromUrl = require('require-from-url/sync');

const views = {
    dashboard: (req, res, data) => {
        const originPath = "https://ventumdashboard.s3.amazonaws.com/dashboard/dashboard.html";
        try {
            JSDOM.fromURL(originPath)
                .then(dom => {
                    var script = dom.window.document.createElement("script");
                    script.type = "module";
                    var innerHTML = `import dashboard from "https://ventumdashboard.s3.amazonaws.com/dashboard/dashboard.js";`;
                    innerHTML += `dashboard.create((${JSON.stringify(data)}))`;
                    script.innerHTML = innerHTML;
                    dom.window.document.body.appendChild(script);
                    res.send((dom.serialize()));
                })
                .catch(err => reject(err));
        } catch (error) {
            res.status(500).send(error);
        }
    },
    login: (req, res, data) => {
        const originPath = "https://ventumdashboard.s3.amazonaws.com/login/login.html";
        try {
            JSDOM.fromURL(originPath)
                .then(dom => {
                    // var script = dom.window.document.createElement("script");
                    // script.type = "module";
                    // var innerHTML = `import dashboard from "https://ventumdashboard.s3.amazonaws.com/dashboard/dashboard.js";`;
                    // innerHTML += `dashboard.create((${JSON.stringify(data)}))`;
                    // script.innerHTML = innerHTML;
                    // dom.window.document.body.appendChild(script);
                    res.send((dom.serialize()));
                })
                .catch(err => reject(err));
        } catch (error) {
            res.status(500).send(error);
        }
    }
};

module.exports = views;