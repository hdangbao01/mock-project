const header = document.querySelector('.header')
const content = document.querySelectorAll('.content')

window.onscroll = () => {
    if (window.pageYOffset > 50) {
        header.classList.add("fixed")
    } else {
        header.classList.remove("fixed")
    }
}

const checkContent = () => {
    for(let i = 0; i < content.length; i++) {
        const wHeight = window.innerHeight 
        const contentTop = content[i].getBoundingClientRect().top

        if (contentTop < wHeight - 150) {
            content[i].classList.add('active')
        } else {
            content[i].classList.remove('active')
        }
    }
}

window.addEventListener('scroll', checkContent)