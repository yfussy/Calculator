let result = 0;
let previousOperator;
let buffer = '0';

const screen = document.querySelector('.screen')

function getButton(value){
    if (isNaN(value)){
        handleSymbol(value)
    }else{
        handleNumber(value)
    }
    console.log(`result:${result}, previousOp: ${previousOperator}, buffer: ${buffer} [button pressed: ${value}]`);
    screen.innerText = buffer;
}

function handleSymbol(symbol){
    switch (symbol) {
        case '←':
            if (buffer.length === 1) {
                buffer = '0';
            }else {
                buffer = buffer.slice(0, -1);
            }
            break;
        case 'C':
            buffer = '0';
            result = 0;
            break;
        case 'CE':
            buffer = '0';
            break;
        case '=':
            if (previousOperator === null){
                return;
            }
            runOperation(parseInt(buffer));
            buffer = result;
            previousOperator = null;
            result = 0;
            break;
        case '.':
            buffer += '.';
            break;
        case '+':
        case '−':
        case '×':
        case '÷':
            handleMath(symbol);
            break;

    }
}
function handleNumber(numString){
    if (buffer === '0'){
        buffer = numString;
    }else {
        buffer += numString;
    }
}
function handleMath(symbol){
    if(buffer === '0'){
        return;
    }
    const value = parseInt(buffer);

    if(result === 0){
        result = value;
    }else{
        runOperation(value);
    }
    previousOperator = symbol;
    buffer = '0';

}
function runOperation(value){
    switch (previousOperator) {
        case '+':
            result += value;
            break;
        case '−':
            result -= value;
            break;
        case '×':
            result = result * value;
            break;
        case '÷':
            result /= value;
            break;
    }
    console.log(result)
}

function init(){
    document.querySelector('.calc-buttons').addEventListener('click', function(event){
        getButton(event.target.innerText);
    })
}

init()