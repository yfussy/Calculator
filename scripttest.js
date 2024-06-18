let result = 0;
let previousOperator = null;
let buffer = '0';
let show;
let equalStatus = false;
let specialOperator = ['1/x', 'x²', '%', '√'];
let prePreviousOperator = null;
let forcedShow;

const screen = document.querySelector('.screen')

function getButton(value){
    if (isNaN(value)){
        handleSymbol(value)
    }else{
        handleNumber(value)
    }

    if (forcedShow || forcedShow == 0){
        show = forcedShow;
    } else {
        if (buffer && buffer !== '0') {
            show = buffer;
        } else {
            show = result;
        }
    }
    screen.innerText = show;
 
    console.log(`buffer: ${buffer} [${typeof buffer}]\npreviousOp: ${previousOperator} [${typeof previousOperator}] \nresult: ${result} [${typeof result}] \nshow: ${show} [${typeof show}] \nequalStatus: ${equalStatus} \nprePreviousOp: ${prePreviousOperator} \nforcedShow: ${forcedShow} [${typeof forcedShow}] \n[button pressed: ${value}]`);
}

function handleSymbol(symbol){
    switch (symbol) {
        case '←':
            // if (forcedShow != buffer) {
            //     forcedShow = String(forcedShow)
            //     if (forcedShow.length === 1 || (forcedShow.length === 2 && forcedShow.charAt(0) === '-')) {
            //         forcedShow = 0;
            //         buffer = forcedShow;
            //         forcedShow = null;
            //     } else {
            //         forcedShow = String(forcedShow).slice(0,-1);
            //         buffer = forcedShow;
            //         forcedShow = null;
            //     }
            //     return;
            // }
            if (isNaN(buffer) || equalStatus || forcedShow){
                console.log('wtf')
                return;
            }
            if (buffer.length === 1 || (buffer.length === 2 && buffer.charAt(0) === '-')) {
                if (result && previousOperator){
                    buffer = '0'
                    forcedShow = 0;
                    return;
                } else {
                    buffer = '0';
                    return;
                }
                
            }else {
                buffer = buffer.slice(0, -1);
            }
            break;
        case 'C':
            buffer = '0';
            result = 0;
            previousOperator = null;
            equalStatus = false;
            forcedShow = null;
            prePreviousOperator = null;
            break;
        case 'CE':
            buffer = '0';
            forcedShow = null;
            previousOperator = previousOperator || prePreviousOperator;
            prePreviousOperator = null;
            break;
        case '=':
            if (previousOperator === null){
                return;
            }
            if (buffer === '0'){
                result = handlePrecision(result,result);
                buffer = result;
                previousOperator = null;
                result = 0;
                equalStatus = true;
                forcedShow = null;
                prePreviousOperator = null;
                return;
            }
            result = handlePrecision(result, parseFloat(buffer));
            buffer = result;
            previousOperator = null;
            result = 0;
            equalStatus = true;
            forcedShow = null;
            prePreviousOperator = null;
            break;
        case '.':
            if (forcedShow){
                buffer = '0.';
                forcedShow = null;
                return;
            }
            if (buffer === '0' || buffer === '0.' || equalStatus){
                buffer = '0.';
            }
            else{
                buffer += '.';
            }
            equalStatus = false;
            break;
        case '±':
            if (buffer === '0'){
                return;
            }
            if (forcedShow){
                if (String(buffer).indexOf('-') > -1){
                    forcedShow = String(buffer).replace('-', '');
                }else{
                    forcedShow = '-' + forcedShow;
                }
            }
            if (String(buffer).indexOf('-') > -1){
                buffer = String(buffer).replace('-', '');
            }else{
                buffer = '-' + buffer;
            }
            break;
        case '1/x':
            prePreviousOperator = previousOperator;
            previousOperator = symbol;
            if (result) {
                if (buffer !== '0'){
                    if (prePreviousOperator === '÷') {
                        forcedShow = handlePrecision(1, buffer);
                        previousOperator = '×';
                        return;
                    } else if (prePreviousOperator === '×'){
                        forcedShow = handlePrecision(1, buffer);
                        previousOperator = '÷';
                        return;
                    } else {
                        buffer = handlePrecision(1, buffer);
                        forcedShow = buffer;
                        previousOperator = prePreviousOperator;
                        return;
                    }
                } else {
                    if (prePreviousOperator === '÷') {
                        forcedShow = handlePrecision(1, result);
                        buffer = result;
                        previousOperator = '×';
                        return;
                    } else if (prePreviousOperator === '×'){
                        forcedShow = handlePrecision(1, result);
                        buffer = result;
                        previousOperator = '÷';
                        return;
                    } else {
                        buffer = handlePrecision(1, result);
                        forcedShow = buffer;
                        previousOperator = prePreviousOperator;
                        return;
                    }
                }
            } else{
                result = handlePrecision(1,buffer);
                buffer = result;
                result = 0;
                previousOperator = null;
                equalStatus = true;
            }
            break;
        case 'x²':
            prePreviousOperator = previousOperator;
            previousOperator = symbol;
            if (result) {
                if (buffer !== '0') {
                    buffer = handlePrecision(buffer,2);
                    forcedShow = buffer;
                    previousOperator = prePreviousOperator;
                    return;
                } else {
                    buffer = handlePrecision(result, 2);
                    forcedShow = buffer;
                    previousOperator = prePreviousOperator;
                    return;
                }
                
            } else {
                result = handlePrecision(buffer, 2);
                buffer = result;
                forcedShow = buffer;
                result = 0;
                previousOperator = null;
                equalStatus = true;
            }
            break;
        case '√':
            prePreviousOperator = previousOperator;
            previousOperator = symbol;
            if (result) {
                if (buffer !== '0') {
                    buffer = handlePrecision(buffer,0.5);
                    forcedShow = buffer;
                    previousOperator = prePreviousOperator;
                    return;
                } else {
                    buffer = handlePrecision(result, 0.5);
                    forcedShow = buffer;
                    previousOperator = prePreviousOperator;
                    return;
                }
                
            } else {
                result = handlePrecision(buffer, 0.5);
                buffer = result;
                forcedShow = buffer;
                result = 0;
                previousOperator = null;
                equalStatus = true;
            }
            break;
        case '%':
            prePreviousOperator = previousOperator;
            previousOperator = symbol;
            if (equalStatus) {
                buffer = handlePrecision(handlePrecision(buffer,2, operation='x²'),100, operation='÷');
                forcedShow = buffer;
                return;
            }
            if (!prePreviousOperator){
                handleSymbol('C');
                return;
            } 
            if (result){
                if (buffer !== '0') {
                    if (prePreviousOperator === '×' || prePreviousOperator === '÷'){
                        buffer = handlePrecision(buffer, 100, operation='÷');
                        forcedShow = buffer;
                        previousOperator = prePreviousOperator;
                        return;
                    } else {
                        buffer = handlePrecision(result,buffer);
                        forcedShow = buffer;
                        previousOperator = prePreviousOperator;
                        return;
                    }
                } else {
                    if (prePreviousOperator === '×' || prePreviousOperator === '÷'){
                        buffer = handlePrecision(result, 100, operation='÷');
                        forcedShow = buffer;
                        previousOperator = prePreviousOperator;
                        return;
                    } else {
                        buffer = handlePrecision(result,result);
                        forcedShow = buffer;
                        previousOperator = prePreviousOperator;
                        return;
                    }
                }
            }
        
            break;
        case '+':
        case '−':
        case '×':
        case '÷':
            equalStatus = false;
            handleMath(symbol);
            break;
    }
}
function handleNumber(numString){

    if (buffer === '0' || forcedShow){
        buffer = numString;
        forcedShow = null;
        equalStatus = false;
        if (prePreviousOperator && forcedShow){
            previousOperator = prePreviousOperator;
            prePreviousOperator = null;
        }
    }else {
        if (equalStatus){
            handleSymbol('C');
            equalStatus = false;
            buffer = numString;
        }else{
            buffer += numString;
        }
        
    }
}
function handleMath(symbol){
    if(buffer === '0'){
        return;
    }
    const value = parseFloat(buffer);

    if(result === 0 && !(specialOperator.includes(symbol))){
        result = value;
    }else{
        result = handlePrecision(result, value);
    }
    previousOperator = symbol;
    buffer = '0';
    forcedShow = null;

}

function init(){
    document.querySelector('.calc-buttons').addEventListener('click', function(event){
        getButton(event.target.innerText);
    })
}


function handlePrecision(num1, num2, operation='') {
    let longestDp = findLongestDp([num1, num2]);
    let answer;
    console.log(longestDp);
    switch (operation || previousOperator){
        case '+':
            answer = (Math.round(num1 * longestDp) + Math.round(num2 * longestDp))/longestDp;
            break;
        case '−':
            answer = (Math.round(num1 * longestDp) - Math.round(num2 * longestDp))/longestDp;
            break;
        case '×':
            answer = (Math.round(num1 * longestDp) * Math.round(num2 * longestDp))/(longestDp * longestDp);
            break;
        case '÷':
        case '1/x':
            answer = (num1 * longestDp) / (num2 * longestDp);
            break;
        case '√':
            answer = num1 ** num2; 
            break;
        case 'x²':
            answer = (num1 ** num2).toFixed(Math.log10(longestDp ** 2)); 
            break;
        case '%':
            answer = num1 * (handlePrecision(num2, 100, operation='÷'));
            break;
            

    }
    console.log(answer);
    return answer;
}

function findLongestDp(numList) {
    let longestDp = 1;
    for (let i = 0; i < numList.length; i++) {
        const num = String(numList[i]);
        
        if (num.includes('.')){
            const splitDecimal = num.split('.');
            let dp = 10 ** splitDecimal[1].length;
            if (dp > longestDp){
                longestDp = dp
            }
        }
        
    }
    return longestDp;
}

init();