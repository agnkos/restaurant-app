import { menuArray } from "./data.js";

let orderItemsArray = []
const orderDetails = document.getElementById('order-details')
const payForm = document.getElementById('pay-form')
let orderItemsHtml
let totalPrice

window.addEventListener('load', renderMenu)

function getMenuHtml() {
    let menuHtml = ''
    menuArray.forEach(function (menuItem) {
        menuHtml += `
        <div class="menu-item-container">
            <div class="menu-item">
                <img src="${menuItem.src}" alt="">
                <div class="item-data">
                    <p class="item-title">${menuItem.name}</p>
                    <p class="item-description">${menuItem.ingredients.join(", ")}</p>
                    <p class="item-price">$${menuItem.price}</p>
                </div>
            </div>
            <div class="add-btn" data-add="${menuItem.id}">+</div>
        </div>
        `
    })
    return menuHtml
}

function renderMenu() {
    document.getElementById('menu').innerHTML = getMenuHtml()
}

document.addEventListener('click', function (e) {
    if (e.target.dataset.add) {
        handleAddClick(e.target.dataset.add)
    } else if (e.target.dataset.remove) {
        handleRemoveClick(e.target.dataset.remove)
    } else if (e.target.id === 'order-btn') {
        handleOrderBtn()
    } else if (e.target.id === 'modal-close-btn') {
        closeModal()
    } else if (e.target.classList.contains('fa-star')) {
        rateService(e.target.id)
    }
})

function handleAddClick(itemId) {
    document.getElementById('thanks-info').style.display = 'none'
    const targetMenuItem = menuArray[itemId]
    orderItemsArray.push(targetMenuItem)
    renderOrder()
}

function handleRemoveClick(orderArrayIndex) {
    orderItemsArray.splice(orderArrayIndex, 1)
    renderOrder()

}

function getOrderHtml() {
    let index = 0
    totalPrice = 0
    orderItemsHtml = ''
    orderItemsArray.forEach(function (item) {
        orderItemsHtml += `
     <div class="order-item-container"> 
        <div class="flex-center">
            ${item.name}
            <button class="remove-btn" data-remove="${index}">remove</button> 
        </div>
        <p>$${item.price}</p>
     </div>
     `
        index++
        totalPrice += item.price
    })
    pizzaDiscount()
    document.getElementById('total-price').innerHTML = totalPrice
    return orderItemsHtml
}

function pizzaDiscount() {
    const pizzas = orderItemsArray.filter(function (item) {
        return item.name === 'Pizza'
    })
    const n = Math.floor(pizzas.length / 4)
    if (n > 0) {
        orderItemsHtml += `
        <div class="order-item-container"> 
           <div class="flex-center">
              Pizza Discount
           </div>
           <p>-$${14 * n}</p>
        </div>
        `
        totalPrice -= 14 * n
    }
}

function renderOrder() {
    if (orderItemsArray.length) {
        orderDetails.classList.remove('hidden')
    } else {
        orderDetails.classList.add('hidden')
    }
    document.getElementById('order-items').innerHTML = getOrderHtml()
}

function handleOrderBtn() {
    document.getElementById('modal').style.display = 'block';
    (Array.from(document.getElementsByTagName('input'))).forEach(function (inputEl) {
        inputEl.value = ''
    })
}

payForm.addEventListener('submit', function (event) {
    event.preventDefault()

    const payFormData = new FormData(payForm)
    const fullName = payFormData.get('fullName')

    orderDetails.classList.add('hidden')
    orderItemsArray = []
    document.getElementById('modal').style.display = 'none'
    document.getElementById('thanks').textContent = `
    Thanks, ${fullName}! Your order is on its way!
    `
    document.getElementById('thanks-info').style.display = 'block'
})

function closeModal() {
    document.getElementById('modal').style.display = 'none';
}

function rateService(idClicked) {
    const stars = Array.from(document.getElementsByClassName('fa-star'))
    stars.forEach(star => star.style.color = '#757575')
    const starsClicked = stars.filter(function (star) {
        return star.id <= idClicked
    })
    starsClicked.forEach(star => star.style.color = 'gold')
}
