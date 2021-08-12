// Constructor function for each wine
function Wine(name, price) {
    this.name = name;
    this.qty = 0;
    this.price = price;
    this.total = 1;
}

// object with original prices
let originalPrice = {
    beaux: 7.50,
    chateau: 3,
    federalist:8.8,
    cabernet:9.25,
    domaine:6,
    lewis:4
}

// Object containing Quantity of each wine
const quantityObject = {
    beaux: 0,
    chateau: 0,
    federalist: 0,
    cabernet: 0,
    domaine:0,
    lewis:0
}

// Object containing total value of each wine based on quantity and price 
const totalValue = {
    beaux: 0,
    chateau: 0,
    federalist: 0,
    cabernet: 0,
    domaine:0,
    lewis:0
}

const allWines = Object.keys(quantityObject);
let found=0;


/*
Using EVENT DELEGATION here. Event listener on parent div with class wine 
*/
document.querySelector('.wine').addEventListener('click', (event) => {
    const target = event.target;

    if (target.tagName === "BUTTON") {

        // To retrieve data from UI
        const priceOnUI = target.parentElement.previousElementSibling
        let wineName = priceOnUI.previousElementSibling.textContent;
        let wineFirstname = wineName.split(' ')[0].toLowerCase();
        const returnVal = priceOnUI.textContent.substr(1,priceOnUI.textContent.length-1);
        let wineCost = parseFloat(returnVal);

        // If the button clicked is +
        if (target.textContent === '+') {

            const wine = new Wine(wineName, wineCost)
            wine.qty = parseInt(target.previousElementSibling.textContent)
            wine.qty = wine.qty + 1;
            target.previousElementSibling.textContent = wine.qty;
            if(wine.qty>=1)
            {
            wine.total = wine.qty * originalPrice[wineFirstname];
            priceOnUI.textContent = `$ ${wine.total.toFixed(2)}`
        }
        billingDetails(wine.name,originalPrice[wineFirstname],wine.total, wine.qty, 'inc');
        }

        // if the button clicked is -
        else if (target.textContent === '-') {

            //Ensure the value does not go below 0
            if(target.nextElementSibling.textContent>=1)
            {
            const wine = new Wine(wineName, wineCost);
            wine.qty = parseInt(target.nextElementSibling.textContent)
            wine.qty = wine.qty - 1;
            target.nextElementSibling.textContent = wine.qty;

            if(wine.qty>=1){
            wine.total = wine.qty * originalPrice[wineFirstname];
            priceOnUI.textContent = `$ ${wine.total.toFixed(2)}`
            }
            billingDetails(wine.name,originalPrice[wineFirstname],wine.total, wine.qty, 'dec')
            }
        }
    }
})


// Calculates the final billing details 
function billingDetails(name, originalPrice, total, qty, value){
    let tr;
    const drinksCalculation = document.querySelector('.drinks-calc table');
    let wineName = name.split(' ')[0].toLowerCase();

    if(qty==0 && value==="dec") quantityObject[wineName] = 0;

    // Qty will get modified in real time based on data in object and price
    if(quantityObject[wineName]==0 || found == 0 || qty==0)
    {   
        if(value == 'dec'){
            document.querySelectorAll('.newRow').forEach((row)=>{
                if(row.firstElementChild.textContent === name){
                    row.remove();
                }
            })
            found=0;
        }   else {
        
        // Creating a new DOM element if the wine is not there
        tr = document.createElement('tr');
        tr.className = "newRow"
        tr.innerHTML = `
        <td class="names">${name}</td>
        <td>$${originalPrice} x ${qty}</td>
        <td>$${total.toFixed(2)}</td>
        `
        document.querySelector('.drinks-calc table').appendChild(tr);
        found = 1;
        }
    }
    else{
        drinksCalculation.querySelectorAll('tr').forEach((row) =>
        {
            if(row.firstElementChild.textContent === name){
                found = 1;
                row.innerHTML = `
                <td class="names">${name}</td>
                <td>$${originalPrice} x ${qty}</td>
                <td>$${total.toFixed(2)}</td>
                `
            }else{
                found = 0;
            }
        })
    }
    quantityObject[wineName] = qty;

    calculateTotal();
}

let totalDrinksPrice;


// Calculating the total price for the entire order
function calculateTotal(){

    if(document.querySelectorAll('.drinks-calc table tr').length===0){
        for(let x in totalValue){
            totalValue[x] =0;
        }
    }else{
    document.querySelectorAll('.drinks-calc table tr').forEach((row)=>{
        let totalValueOfWine = parseFloat(row.lastElementChild.textContent.substr(1,4));
        totalValue[row.firstElementChild.textContent.split(' ')[0].toLowerCase()]=totalValueOfWine;
    })}

    let array = Object.values(totalValue);

    totalDrinksPrice=0;
    for(let i = 0; i<= array.length-1; i++){
        totalDrinksPrice += array[i];
    }
    document.querySelector('.subtotal').textContent = `$${totalDrinksPrice.toFixed(2)}`;
    document.querySelector('.submit').textContent = `PAY $${(totalDrinksPrice+5).toFixed(2)}`;
    
}   
