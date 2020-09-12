
export const login = () => {

}

export const signUp = (app) => {

    const request = new Request('/signup', {
        method:'post',
        body: JSON.stringify({
            username: 'ferf',
            email: 'fefr',
            password: 'ferfer'
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