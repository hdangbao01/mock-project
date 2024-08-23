const $ = document.querySelector.bind(document)

const nameStudent = $('#name')
const gender = $('#gender')
const email = $('#email')
const phone = $('#phone')
const classStudent = $('#class')
const address = $('#address')
const btn = $('.btn-pro5')

const getData = (keyStorage) => {
    return JSON.parse(localStorage.getItem(keyStorage)) || []
}

const setData = (keyStorage, arr) => {
    localStorage.setItem(keyStorage, JSON.stringify(arr))
}

const handleRenderTable = () => {
    const renderList = $('.table-list-sudent')
    arr = getData('listStudent')

    const htmls = arr.map((item, i) => {
        return `
            <ul class="table-list">
                <li class="table-item">${i + 1}</li>
                <li class="table-item">${item.name}</li>
                <li class="table-item">${item.gender}</li>
                <li class="table-item">${item.email}</li>
                <li class="table-item">${item.phone}</li>
                <li class="table-item">${item.class}</li>
                <li class="table-item">${item.address}</li>
                <li class="table-item">
                    <button class="btn-delete">Xoá</button>
                </li>
            </ul>
        `
    })

    renderList.innerHTML = htmls.join('')

    const handleDelete = () => {
        const arr = getData('listStudent')
    
        document.querySelectorAll('.btn-delete').forEach((item, i) => {
            item.addEventListener('click', e => {
                arr.splice(i, 1);
    
                setData('listStudent', arr)
                handleRenderTable()
            })
        });
    }

    handleDelete()
}

const addStudent = () => {
    const arr = getData('listStudent')

    const data = {
        name: nameStudent.value,
        gender: gender.value,
        email: email.value,
        phone: phone.value,
        class: classStudent.value,
        address: address.value,
    }

    arr.push(data)

    setData('listStudent', arr)
    reset()
    handleRenderTable()
}
btn.addEventListener("click", addStudent)

const reset = () => {
    nameStudent.value = ""
    gender.value = ""
    email.value = ""
    phone.value = ""
    classStudent.value = ""
    address.value = ""
}

const start = () => {
    handleRenderTable()
}

start()