export function hasExpired(token){
    const body = JSON.parse(window.atob(token.split('.')[1]));
    if((Date.now()/1000) > body.exp){
        return true;
    }else{
        return false;
    }
}

export function getToken(){
    const token = localStorage.getItem("token");
    if(!token || hasExpired(token)){
        return false;
    }else{
        return token;
    }
}
