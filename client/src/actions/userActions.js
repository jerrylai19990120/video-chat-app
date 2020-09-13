const bcrypt = require('bcryptjs');

export const login = (info, app) => {

    const username = info.state.username;
    const password = info.state.password;

    const request = new Request('/loginSession', {
        method: 'post',
        body: JSON.stringify({
            username: username
        }),
        headers: {
            Accept: 'application/json, text/plain, */*',
            "Content-type": 'application/json'
        }
    })

    fetch('/loginAuth')
        .then(result => {
            return result.json();
        })
        .then(json => {

            for(let i=0;i<json.length;i++){
                bcrypt.compare(password, json[i].password, (err, res)=>{
                    if(json[i].username === username && res === true){
                        app.setState({currentUser: json[i].email})
                        fetch(request)
                            .then(result => {
                                if(result.status===200){
                                    return result;
                                }
                            })
                            .catch(error => {
                                console.log(err)
                            })
                    }
                })
            }
        })

}

export const signUp = (info, app) => {


    const request = new Request('/signup', {
        method:'post',
        body: JSON.stringify({
            username: info.state.username,
            email: info.state.email,
            password: info.state.password
        }),
        headers: {
            Accept: "application/json, text/plain, */*",
            "Content-type": "application/json"
        }
    })

    fetch(request)
        .then(res => {
            if(res.status===200){
                return res.json();
            }
        })
        .then(json => {
            app.setState({currentUser: json.email})
        })
        .catch(err => {
            console.log(err);
        })


}