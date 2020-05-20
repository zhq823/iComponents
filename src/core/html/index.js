class iHtml {
    constructor(){

    }

    static telCall(telephone){
        window.location.href = 'tel://' + telephone;
    }
}
export default iHtml