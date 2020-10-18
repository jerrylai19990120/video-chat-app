const bcrypt = require('bcryptjs');

export const login = (info, app) => {


    const request = new Request('/loginSession', {
        method: 'post',
        body: JSON.stringify({
            username: info.state.username
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
            const username = info.state.username;
            const password = info.state.password;

            for(let i=0;i<json.length;i++){
                bcrypt.compare(password, json[i].password, (err, res)=>{
                    if(json[i].username === username && res === true){
                        app.setState({currentUser: json[i].username})
                        fetch(request)
                            .then(result => {
                                if(result.status===200){
                                    return result;
                                }
                            })
                            .catch(error => {
                                console.log(error)
                            })
                    }else{
                        info.setState({isInvalid: true, warnings: 'wrong password'})
                    }
                })
            }
        })

}

export const signUp = async (info, app) => {

    await fetch('/loginAuth')
        .then(result => {
            return result.json();
        })
        .then(json => {
            for(let i=0;i<json.length;i++){
                if(json[i].username === info.state.username){
                    info.setState({duplicateName: true, nameWarn: 'Username already exists'});
                    break;
                }
                if(i===(json.length-1) && json[i].username !== info.state.username){
                    info.setState({duplicateName: false, nameWarn: ''});
                }
            }
        })
        .catch(err => {
            console.log(err);
        })

    if(info.state.duplicateName === true){
        return;
    }else{
        info.setState({duplicateName: false, nameWarn: ''});
    }
    
    
    if(!(/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/.test(info.state.email))){
        info.setState({emailInvalid: true, emailWarnings: 'improper email address'})
        return;
    }else{
        info.setState({emailInvalid: false, emailWarnings: ''})
    }
    if(!(info.state.password === info.state.confirm)){
        info.setState({invalid: true, warnings: 'password does not match'});
        return;
    }else{
        info.setState({invalid: false, warnings: ''});
    }
    const request = new Request('/signup', {
        method:'post',
        body: JSON.stringify({
            username: info.state.username,
            email: info.state.email,
            password: info.state.password,
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
            app.setState({currentUser: json.username})
        })
        .catch(err => {
            console.log(err);
        })


}

export const readCookie = (app)=>{

    fetch('/check-session')
        .then(result => {
            if(result.status===200){
                return result.json();
            }
        })
        .then(json => {
            if(json && json.currentUser){
                app.setState({currentUser: json.currentUser});
            }
        })
        .catch(err => {
            console.log(err)
        })
}

export const logOut = (app) => {
    app.setState({currentUser: null});
    fetch('/logout')
        .then(res => {
            if(res.status === 200){
                res.send()
            }
        })
        .catch(err => {
            console.log(err)
        })
}