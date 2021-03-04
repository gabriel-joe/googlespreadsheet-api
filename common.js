let monthArray = [];
monthArray[0] = "01";
monthArray[1] = "02";
monthArray[2] = "03";
monthArray[3] = "04";
monthArray[4] = "05";
monthArray[5] = "06";
monthArray[6] = "07";
monthArray[7] = "08";
monthArray[8] = "09";
monthArray[9] = "10";
monthArray[10] = "11";
monthArray[11] = "12";

let paymentTypeArray = []
paymentTypeArray["cartão"] = "Bank"
paymentTypeArray["dinheiro"] = "Phisical"

let typeCastArray = []
typeCastArray["mercado"] = "Market"
typeCastArray["shopping"] = "Shopping"
typeCastArray["comida"] = "Food"
typeCastArray["apartamento"] = "Apt-Fees"
typeCastArray["transporte"] = "Transport"
typeCastArray["celular"] = "Cellphone"
typeCastArray["transferência"] = "Transfer"
typeCastArray["farmácia"] = "Farmacy"
typeCastArray["taxas"] = "Tax fees"
typeCastArray["outros"] = "Others"

function capitalize (s) {
    if (typeof s !== 'string') return ''
    return s.charAt(0).toUpperCase() + s.slice(1)
}

module.exports = {
    paymentTypeArray: paymentTypeArray,
    monthArray: monthArray,
    typeCastArray: typeCastArray,
    capitalize: capitalize
}