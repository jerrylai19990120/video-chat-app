
export const login = () => {

}

export const signUp = (info, app) => {

    const username = info.state.username;
    const email = info.state.email;
    const password = info.state.password;

    const request = new Request('/signup', {
        method:'post',
        body: JSON.stringify({
            username: username,
            email: email,
            password: password
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
        .catch(err => {
            console.log(err);
        })


}