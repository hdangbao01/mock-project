const titleNote = document.querySelector('.input-create')
const titleContent = document.querySelector('.note-type')
const btnAdd = document.querySelector('.btn-add')
const modal = document.querySelector('.modal-wrap')
const modalOverlay = document.querySelector('.modal-overlay')

const search = document.querySelector('.search')
const mode = document.querySelector('.mode')
const main = document.querySelector('.main')

const btnClose = document.querySelector('.btn-close')

let indexEdit

const keyStorage = {
    note: "note",
    mode: "mode"
}

const getData = () => {
    return JSON.parse(localStorage.getItem(keyStorage.note)) || []
}

const setData = (arr) => {
    localStorage.setItem(keyStorage.note, JSON.stringify(arr))
}

const handleRenderNote = (arrSearch) => {
    const renderList = document.querySelector('.note-list')
    let arr;
    if(arrSearch){
        arr = arrSearch
    }else {
        arr = getData()
    }

    if (arr == undefined || arr.length == 0) {
        renderList.innerHTML = "Không có ghi chú nào được tạo"
    } else {
        const htmls = arr.map(noteItem => {
            return `
                <li class="note-item">
                    <div class="item-title">
                        ${noteItem.title}
                        <i class="fa-solid fa-ellipsis-vertical icon-option"></i>
                    </div>
                    <p class="item-text">${noteItem.content}</p>
                    <ul class="drop-list">
                        <li class="btn-delete">Xoá ghi chú</li>
                    </ul>
                </li>
            `
        })

        renderList.innerHTML = htmls.join('')
    }
    const handleActive = () => {
        const dropList = document.querySelectorAll('.drop-list')
    
        document.onclick = e => {
            if (!e.target.closest('.icon-option')) {
                dropList.forEach((itemDrop) => {
                    itemDrop.classList.remove('active')
                })
            }
        }
    
        document.querySelectorAll('.icon-option').forEach((item, i) => {
            item.addEventListener('click', e => {
                dropList[i].classList.toggle('active')
            })
        });
    
        modalOverlay.addEventListener("click", () => {
            modal.style.display = "none"
        })
    
        btnClose.addEventListener("click", () => {
            modal.style.display = "none"
        })
    }

    const handleOpenModal = () => {
        document.querySelectorAll('.note-item').forEach((item, i) => {
            const arr = getData()
    
            item.addEventListener('click', e => {
                if (!e.target.closest('.icon-option') && !e.target.closest('.drop-list')) {
                    indexEdit = i
    
                    const renderList = document.querySelector('.modal-main')
    
                    renderList.innerHTML = `
                            <div class="wrap-input">
                                <input placeholder="Nhập tiêu đề..." value="${arr[i].title}" type="text" class="input-create-edit" />
                                <textarea placeholder="Nhập ghi chú..." rows="15" class="note-type-edit">${arr[i].content}</textarea>
                                <p>Tạo ngày: ${arr[i].title}</p>
                                <p class="date">Được tạo: ${arr[i].createdAt.slice(0, 10)}</p>
                            </div>
                        `
    
                    modal.style.display = "block"
                }
            })
        });
    }
    
    const handleEdit = () => {
        const arr = getData()
    
        document.querySelector('.btn-edit').addEventListener('click', () => {
            arr[indexEdit] = {
                ...arr[indexEdit],
                title: document.querySelector('.input-create-edit').value,
                content: document.querySelector('.note-type-edit').value
            }
    
            setData(arr)
    
            modal.style.display = "none"
            handleRenderNote()
        });
    }
    
    
    const handleDelete = () => {
        const arr = getData()
    
        document.querySelectorAll('.btn-delete').forEach((item, i) => {
            item.addEventListener('click', e => {
                arr.splice(i, 1);
    
                setData(arr)
                handleRenderNote()
            })
        });
    }

    handleOpenModal()
    handleActive()
    handleDelete()
    handleEdit()
}

const reset = () => {
    titleNote.value = ""
    titleContent.value = ""
}

const handleAddNote = () => {
    btnAdd.addEventListener('click', () => {
        console.log("check 0")
        if (titleNote.value === "" || titleContent.value === "") {
            alert("Vui lòng nhập đầy đủ ghi chú!")

            return
        }

        const arr = getData();

        const note = {
            title: titleNote.value,
            content: titleContent.value,
            createdAt: new Date()
        }

        arr.push(note);

        setData(arr)

        handleRenderNote()
        reset()
    })
}

const handleSearch = () => {
    search.addEventListener("keydown", (event) => {
        if (event.keyCode === 13) {
            const renderList = document.querySelector('.note-list')
            const arr = getData()

            const searched = arr.filter((item) => {
                return item.title.toLowerCase().includes(search.value.toLowerCase())
            })

            handleRenderNote(searched)
        }
    });
}

const handleDarkMode = () => {
    const darkMode = localStorage.getItem("mode");

    if (darkMode == null || darkMode == 'dark') {
        localStorage.setItem("mode", "dark");
        document.body.classList.add('dark')
        main.classList.add('dark')
        document.querySelector('.note-item')?.classList.add('dark')
    } else {
        mode.innerHTML = '<i class="fa-solid fa-moon"></i>'
    }

    mode.addEventListener("click", () => {
        const darkMode = localStorage.getItem("mode");

        if (darkMode == 'dark') {
            localStorage.setItem("mode", "light");
            mode.innerHTML = '<i class="fa-solid fa-moon"></i>'
        } else {
            localStorage.setItem("mode", "dark")
            mode.innerHTML = '<i class="fa-solid fa-sun"></i>'
        }

        document.body.classList.toggle('dark')
        main.classList.toggle('dark')
        document.querySelector('.note-item')?.classList.toggle('dark')
    })
}

const start = () => {
    handleRenderNote()
    handleAddNote()
    handleSearch()
    handleDarkMode()
}

start()