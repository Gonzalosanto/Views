import utils from 'https://ventumdashboard.s3.amazonaws.com/lib/utils.js';
import category from 'https://ventumdashboard.s3.amazonaws.com/dashboard/category.js';

//Dflt Dashboards State
const dfltState = {
    parentState: null,
    contentDiv: null, //Contenedor donde voy a dibujar cada pantalla...
    id: "id",
    company: {
        name: "CompanyName"
    },
    user: {
        name: "UserName",
    },
    categories: {},
    logOut: {},
    selectedCat: null
};

//Each state represents a Dashboard
var states = [];

//Commands that can be executed by this Component (Dashboard)
const cmd = (state, cmds, res, pos) => {

    const clearContent = (state, payload, res) => {
        return new Promise((resolve, reject) => {
            state.contentDiv.innerHTML = null;
            resolve();
        });
    };

    const ifStatement = (state, payload, res) => {

        return new Promise((resolve, reject) => {
            if (eval(payload.condition)) {
                console.log("condicion cumplida!");
            } else {
                console.log("condicion NO cumplida!");
            }
            resolve("ok");
        });
    };

    const selectCategory = (state, payload, res) => {
        return new Promise((resolve, reject) => {
            try {
                console.log("Category LOG:" + payload.catPath);
                var dirs = payload.catPath.split('/');
                var cat = state.categories[dirs[0]];
                if (dirs[1] != null)
                    cat = cat.subCategories[dirs[1]];

                clearContent(state, null, null)
                    .then(() => {
                        category.create(cat, state.contentDiv);
                        state.selectedCat = cat;
                        resolve(cat);
                    })
                    .catch();
                /*var index = Object.keys(state.categories).indexOf(cat.name);
                var text = document.getElementById(state.id + "-" + cat.name + "-sidebar-main-category-name-text");
        
                Array.prototype.forEach.call(document.getElementsByClassName('ventum-sidebar-main-category-name-text'), (node) => {
                    node.style.color = "";
                });
                text.style.color = "green";*/
            } catch (error) {
                console.log("Error with selected cat! " + error);
                reject(error);
            }
        }); 
    };
    
    const logOut = (state, payload, res) => {
        return new Promise((resolve, reject) => {
            document.cookie = "access-token=; expires=0; path=/";
            location.reload();
            resolve("logOut");
        }); 
    };

    console.log(`cmds´(${JSON.stringify(pos)}): ${JSON.stringify(cmds)}`);

    return new Promise((resolve, reject) => {
        //A: Si ya ejecuté todos los comandos termino
        if (Object.keys(cmds).length <= pos) {
            resolve(res);
        } else {
            var c = null;
            var command = cmds[pos];
            switch (command.type) {
                case "parent-cmd":
                    c = () => parentCmd(state, command.payload, res);
                    break;
                case "if":
                    c = () => ifStatement(state, command.payload, res);
                    break;
                case "select-category":
                    c = () => selectCategory(state, command.payload, res);
                    break;
                case "log-out":
                    c = () => logOut(state, command.payload, res);
                    break;
                default:
                    console.log(`Cmd not found: ${command.type}`);
                    c = () => new Promise((res, rej) => { rej(`Cmd not found: ${command.type}`) });
                    break;
            }

            c()
                .then((res) => {
                    cmd(state, cmds, res, pos + 1);
                })
                .then((res) => resolve(res))
                .catch(err => {
                    console.log(err);
                    reject(err);
                });
        }
    })
};

//Creates a new Dashboard
const create = (newState, parentState) => {
    newState = utils.fillObjWithDflt(newState, dfltState);
    newState.parentState = parentState;
    Object.values(categories).forEach(cat => {
        category.create(cat, newState);
    });
    states.push(newState);
};


const show = (state, parent) => {

    const createNav = () => {
        var nav = document.createElement("div");
        nav.id = state.id + "-nav";
        nav.className = 'ventum-nav '; //overflow-auto
        nav.style.height = window.innerHeight + "px";
        nav.style.overflowY = "auto";
        nav.style.overflowX = "hidden";
        return nav;
    };

    const createSidebar = () => {

        const companyInfo = () => {
            var companyDiv = document.createElement("div");
            companyDiv.id = state.id + "-sidebar-company-div";
            companyDiv.className = 'ventum-sidebar-company';

            var logoDiv = document.createElement("div");
            logoDiv.id = state.id + "-sidebar-company-logo-div";
            logoDiv.className = 'ventum-sidebar-company-logo';

            var logo = document.createElement("i");
            logo.id = state.id + "-sidebar-company-logo-icon";
            logo.className = 'icon-compass icon-2x ventum-sidebar-company-logo-i';

            logoDiv.appendChild(logo);
            companyDiv.appendChild(logoDiv);

            var nameDiv = document.createElement("div");
            nameDiv.id = state.id + "-sidebar-company-name-div";
            nameDiv.className = 'ventum-sidebar-company-name';

            var nameText = document.createElement("button");
            nameText.id = state.id + "-sidebar-company-name-text";
            nameText.className = 'ventum-sidebar-company-name-text';
            nameText.href = "";
            nameText.innerHTML = state.company.name;

            nameDiv.appendChild(nameText);
            companyDiv.appendChild(nameDiv);

            return companyDiv;
        };

        const separatorLine = () => {
            var line = document.createElement("div");
            line.className = 'ventum-sidebar-separator-line';
            return line;
        };

        const separatorSpace = (height) => {
            var companyDiv = document.createElement("div");
            companyDiv.className = 'ventum-sidebar-separator-space';
            companyDiv.style.height = (height || 3) + '%';
            return companyDiv;
        };

        const userInfo = () => {
            var userDiv = document.createElement("div");
            userDiv.id = state.id + "-sidebar-user-div";
            userDiv.className = 'ventum-sidebar-user';

            var logoDiv = document.createElement("div");
            logoDiv.id = state.id + "-sidebar-user-logo-div";
            logoDiv.className = 'ventum-sidebar-user-logo';

            var logo = document.createElement("i");
            logo.id = state.id + "-sidebar-user-logo-icon";
            logo.className = 'icon-compass icon-2x ventum-sidebar-user-logo-i';

            logoDiv.appendChild(logo);
            userDiv.appendChild(logoDiv);

            var nameDiv = document.createElement("div");
            nameDiv.id = state.id + "-sidebar-user-name-div";
            nameDiv.className = 'ventum-sidebar-user-name';

            var nameText = document.createElement("button");
            nameText.id = state.id + "-sidebar-user-name-text";
            nameText.className = 'ventum-sidebar-user-name-text';
            nameText.href = "";
            nameText.innerHTML = state.user.name;

            nameDiv.appendChild(nameText);
            userDiv.appendChild(nameDiv);

            return userDiv;
        };

        const createCat = (cat) => {
            if (cat[0] != undefined) {
                console.log(cat[0]);
                var catDiv = document.createElement("div");
                catDiv.id = state.id + "-" + cat.name + "-sidebar-main-category-div";
                catDiv.className = 'ventum-sidebar-main-category';

                var logoDiv = document.createElement("div");
                logoDiv.id = state.id + "-" + cat.name + +"-sidebar-main-category-logo-div";
                logoDiv.className = 'ventum-sidebar-main-category-logo';

                var logo = document.createElement("i");
                logo.id = state.id + "-" + cat.name + "-sidebar-main-category-logo-icon";
                logo.className = 'icon-compass icon-2x ventum-sidebar-main-category-logo-i';

                logoDiv.appendChild(logo);
                catDiv.appendChild(logoDiv);

                var nameDiv = document.createElement("div");
                nameDiv.id = state.id + "-" + cat.name + "-sidebar-main-category-name-div";
                nameDiv.className = 'ventum-sidebar-main-category-name';

                /*var nameText = document.createElement("button");
                nameText.id = state.id + "-" + cat.name + "-sidebar-main-category-name-text";
                nameText.className = 'ventum-sidebar-main-category-name-text';
                nameText.innerHTML = cat.name;*/

                //DROPDOWN BUTTON - CATEGORY
                var nameText = document.createElement("button");
                nameText.className = 'ventum-sidebar-main-category-name-text dropdown-toggle';
                nameText.type = "button";
                nameText.id = state.id + "-" + cat.name + "-sidebar-main-category-name-text";
                nameText.setAttribute('data-toggle', "dropdown");
                nameText.setAttribute('aria-haspopup', "true");
                nameText.setAttribute('aria-expanded', "false");
                nameText.innerHTML = cat.name;
                nameDiv.appendChild(nameText);

                //---------- MENU DEL DROPDOWN ----------------//
                var nameMenu = document.createElement("div");
                nameMenu.className = "dropdown-menu";
                nameMenu.setAttribute('aria-labelledby', state.id + "-" + cat.name + "-sidebar-main-category-name-text");
                nameDiv.appendChild(nameMenu);
                //----------ELEMENTOS DEL MENU------------------------//
                Object.entries(cat).forEach(option => {
                    console.log(option);
                    console.log(option[0]);
                    if (!Number.isNaN(parseInt(option[0]))) {
                        var subCat = option[1];
                        var nameLink = document.createElement("button");
                        nameLink.href = "#";
                        nameLink.className = "dropdown-item";
                        nameLink.innerHTML = subCat.name;
                        nameMenu.appendChild(nameLink);
                        nameLink.onclick = (e) => {
                            e.preventDefault();
                            console.log("Option selected: " + subCat.name);
                            selectCategory(subCat);
                        };
                    }else {
                        console.log("Error al renderizar elemento");
                    }

                });

                nameText.onclick = (e) => {
                    e.preventDefault();
                    console.log("Category selected: " + cat.name);
                    //selectCategory(cat);
                };

                nameDiv.appendChild(nameText);
                catDiv.appendChild(nameDiv);

                return catDiv;
            } else {
                var catDiv = document.createElement("div");
                catDiv.id = state.id + "-" + cat.name + "-sidebar-main-category-div";
                catDiv.className = 'ventum-sidebar-main-category';

                var logoDiv = document.createElement("div");
                logoDiv.id = state.id + "-" + cat.name + +"-sidebar-main-category-logo-div";
                logoDiv.className = 'ventum-sidebar-main-category-logo';

                var logo = document.createElement("i");
                logo.id = state.id + "-" + cat.name + "-sidebar-main-category-logo-icon";
                logo.className = 'icon-compass icon-2x ventum-sidebar-main-category-logo-i';

                logoDiv.appendChild(logo);
                catDiv.appendChild(logoDiv);

                var nameDiv = document.createElement("div");
                nameDiv.id = state.id + "-" + cat.name + "-sidebar-main-category-name-div";
                nameDiv.className = 'ventum-sidebar-main-category-name';

                var nameText = document.createElement("button");
                nameText.id = state.id + "-" + cat.name + "-sidebar-main-category-name-text";
                nameText.className = 'ventum-sidebar-main-category-name-text';
                nameText.innerHTML = cat.name;

                nameText.onclick = (e) => {
                    e.preventDefault();
                    console.log("Category selected: " + cat.name);
                    selectCategory(cat);
                };

                nameDiv.appendChild(nameText);
                catDiv.appendChild(nameDiv);

                return catDiv;
            }

        };

        try {
            var sidebar = document.createElement("div");
            sidebar.id = state.id + "-sidebar";
            sidebar.className = 'ventum-sidebar overflow-auto';

            sidebar.appendChild(companyInfo());
            sidebar.appendChild(separatorLine());
            sidebar.appendChild(userInfo());
            sidebar.appendChild(separatorLine());
            sidebar.appendChild(separatorSpace(3));
            Object.keys(state.categories).forEach(key => {
                var access = state.categories[key].access;
                // if (Object.values(access.names).includes(state.user.name) || Object.values(access.roles).includes(state.user.role))
                //     sidebar.appendChild(createCat(state.categories[key]));
                sidebar.appendChild(createCat(state.categories[key]));
            });

            return sidebar;
        } catch (error) {
            console.log("Error creating sidebar: " + error);
            return null;
        }

    };

    const createContent = () => {

        const navBar = () => {
            var navbarDiv = document.createElement("div");
            navbarDiv.id = state.id + "-content-navbar-div";
            navbarDiv.className = 'ventum-content-navbar-div row';

            var empty = document.createElement("div");
            empty.id = state.id + "-content-navbar-div-exit";
            empty.className = 'col-11';
            navbarDiv.appendChild(empty);

            var exit = document.createElement("div");
            exit.id = state.id + "-content-navbar-div-exit";
            exit.style.position = "relative";
            exit.className = 'col-1 d-flex content-center';
            navbarDiv.appendChild(exit);
            var exitBtn = document.createElement("button");
            exitBtn.id = state.id + "-content-navbar-div-exit";
            exitBtn.className = "btn btn-danger btn-sm";
            exitBtn.style.color = "white";
            exitBtn.style.marginTop = "10%";
            exitBtn.style.marginBottom = "10%";
            exitBtn.innerHTML = "Log Out";
            exitBtn.addEventListener('click', () => {
                logOut(state.logOut);
            });
            exit.appendChild(exitBtn);
            return navbarDiv;
        };

        const separatorLine = () => {
            var line = document.createElement("div");
            line.className = 'ventum-content-separator-line';

            return line;
        };

        try {
            var content = document.createElement("div");
            content.id = state.id + "-content";
            content.className = 'ventum-content '; //overflow-auto
            content.style.overflowY = "auto";
            content.style.overflowX = "hidden";
            content.appendChild(navBar());
            content.appendChild(separatorLine());
            var mainContent = document.createElement("div");
            mainContent.id = state.id + "-content-main";
            mainContent.className = 'ventum-main-content';
            mainContent.style.height = '91%';
            content.appendChild(mainContent);
            return content;
        } catch (error) {
            console.log("Error creating sidebar: " + error);
            return null;
        }

    };

    var nav = createNav();
    var sidebar = createSidebar();
    nav.appendChild(sidebar);
    var content = createContent();
    nav.appendChild(content);
    document.body.appendChild(nav);
    state.contentDiv = content.getElementsByClassName('ventum-main-content')[0];

    var catPath = categories[0].name;
    if (categories[0]["subCategories"] != null)
        catPath += "/" + categories[0]["subCategories"].name;
    
    var cmds = {
        0: {
            type: "select-category",
            payload: {
                catPath: catPath
            }
        }
    }

    cmd(state, cmds, null, 0);
    selectCategory(catPath, state);

};

export default { create, show, cmd};