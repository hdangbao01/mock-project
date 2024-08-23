const modal = document.querySelector('.modal')
const overlay = document.querySelector('.overlay')
const content = document.querySelector('.content')
const listMovie = document.querySelector('.list-movie')
const contentSearch = document.querySelector('.content-search')
const pagination = document.querySelector('.pagination')

let allMovie

const API_GET_LIST_MOVIES = "https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=3fd2be6f0c70a2a598f084ddfb75487c&page="
const API_SEARCH_MOVIE = "https://api.themoviedb.org/3/search/movie?api_key=3fd2be6f0c70a2a598f084ddfb75487c&query="

const fetchMovies = async (page) => {
    const response = await fetch(`${API_GET_LIST_MOVIES}${page}`)
    const listData = await response.json()
    return listData
}

const fetchSearchMovie = async (value) => {
    const response = await fetch(`${API_SEARCH_MOVIE}${value}`)
    const listData = await response.json()
    return listData
}

const renderMovies = async (movies) => {
    const htmls = movies.results.map(item => {
        const { id, title, poster_path, release_date, overview } = item
        const date = release_date.substring(0, 4)

        return `
            <div class="card-item" onclick="clickDetail(${id})">
                <img class="card-poster" src="https://image.tmdb.org/t/p/w1280/${poster_path}" />
                <div class="card-title">
                    <h4>${title}</h4>
                    <div>(${date})</div>
                    <p class="card-overview">${overview}</p>
                </div>
            </div>
        `
    })

    listMovie.innerHTML = htmls.join('')
}

function clickDetail(data) {
    const findMovie = allMovie.find(item => item.id === data)
    overlay.style.display = 'block'
    modal.style.display = 'flex'

    const htmls =  `
        <div class="modal-info">
            <div class="modal-name">${findMovie.title}</div>
            <div><span class="desc">Ngày ra mắt:</span> ${findMovie.release_date}</div>
            <div><span class="desc">Điểm:</span> ${findMovie.vote_average}</div>
            <div><span class="desc">Lượt đánh giá:</span> ${findMovie.vote_count}</div>
            <div class="modal-desc">${findMovie.overview}</div>
        </div>
        <img class="modal-img" src="https://image.tmdb.org/t/p/w1280/${findMovie.poster_path}"/>
    `

    modal.innerHTML = htmls

    
    closeModal()
}

function closeModal() {
    overlay.addEventListener('click', () => {
        overlay.style.display = 'none'
        modal.style.display = 'none'
    })
}

let currentPage = 1
let totalPage
const renderPagination = (page, total) => {
    console.log('render', 'page', page, 'total', total);
    const navPagination = `
        <div class="action prev ${page == 1 ? 'disable' : ''}">Prev</div>
        <ul class="pagi-list">
            ${currentPage > 3 ? `<li class="pagi-item">...</li>` : ''}       
            ${(currentPage - 2) > 0 ? `<li class="pagi-item">${currentPage - 2}</li>` : ''}
            ${(currentPage - 1) > 0 ? `<li class="pagi-item">${currentPage - 1}</li>` : ''}
            <li class="pagi-item active">${currentPage}</li>
            ${(currentPage + 1) < total ? `<li class="pagi-item">${currentPage + 1}</li>` : ''}
            ${(currentPage + 2) < total ? `<li class="pagi-item">${currentPage + 2}</li>` : ''}
            ${currentPage < total ? `<li class="pagi-item">...</li>` : ''}            
        </ul>
        <div class="action next ${page == total ? 'disable' : ''}">Next</div>
    `

    pagination.innerHTML = navPagination

    handlePagination()
}

const handlePagination = () => {
    const pagiItem = document.querySelectorAll('.pagi-item')
    const next = document.querySelector('.next')
    const prev = document.querySelector('.prev')   
    
    pagiItem.forEach(item => {
        item.addEventListener('click', async () => {
            const page = Number(item.childNodes[0].nodeValue)
            currentPage = page
            const movies = await fetchMovies(currentPage)
            renderMovies(movies)
            renderPagination(currentPage, totalPage)
        })
    })

    prev.addEventListener('click', async () => {
        if (currentPage == 1) return
        currentPage -= 1
        const movies = await fetchMovies(currentPage)
        renderMovies(movies)
        renderPagination(currentPage, totalPage)
    })

    next.addEventListener('click', async () => {
        if (currentPage == totalPage) return
        currentPage += 1
        const movies = await fetchMovies(currentPage)
        renderMovies(movies)
        renderPagination(currentPage, totalPage)
    })
}

const handleEvent = () => {
    contentSearch.addEventListener("keypress", async (event) => {
        if (event.key === "Enter") {
            if (contentSearch.value != '') {
                const movies = await fetchSearchMovie(contentSearch.value)
                renderMovies(movies)
            } else {
                start()
            }
        }
    })
}

const start = async () => {
    const movies = await fetchMovies(1)
    allMovie = movies.results
    totalPage = movies.total_pages
    renderMovies(movies)
    renderPagination(currentPage, totalPage)
}

start()
handleEvent()