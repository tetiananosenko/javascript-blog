'use strict'

function titleClickHandler(event) {
    event.preventDefault();
    const clickedElement = this;


    const activeLinks = document.querySelectorAll('.titles a.active');
    for (let activeLink of activeLinks) {
        activeLink.classList.remove('active');
    }

    clickedElement.classList.add('active');

    const activeArticles = document.querySelectorAll('.post.active');
    for (let activeArticle of activeArticles) {
        activeArticle.classList.remove('active');
    }

    const articleSelector = clickedElement.getAttribute('href');
    const targetArticle = document.querySelector(articleSelector);

    targetArticle.classList.add('active');

}

const optArticleSelector = '.post',
    optTitleSelector = '.post-title',
    optTitleListSelector = '.titles';

function generateTitleLinks(customSelector = '') {
    const titleList = document.querySelector(optTitleListSelector);
    let html = '';

    const articles = document.querySelectorAll(optArticleSelector + customSelector);
    for (let article of articles) {
        const articleId = article.getAttribute('id');
        const articleTitle = article.querySelector(optTitleSelector).innerHTML;
        const linkHTML = '<li><a href="#' + articleId + '"><span>' + articleTitle + '</span></a></li>';
        html += linkHTML;
    }

    titleList.innerHTML = html;

    const links = document.querySelectorAll('.titles a');

    for (let link of links) {
        link.addEventListener('click', titleClickHandler);
    }
}
generateTitleLinks();

function generateTags() {
    const articles = document.querySelectorAll('.post');
    for (let article of articles) {
        const postTags = article.querySelector('.post-tags .list');
        let html = '';
        const dataTags = article.getAttribute('data-tags');
        const dataTagsArr = dataTags.split(' ');

        for (let tag of dataTagsArr) {
            const linkHTML = `<li><a href="#tag-${tag}">${tag}</a></li> `;
            html += linkHTML;
        }
        postTags.innerHTML = html;
    }
}

generateTags();

function tagClickHandler(event) {
    event.preventDefault();

    const clickedElement = this;
    const href = clickedElement.getAttribute('href');
    const tag = href.replace('#tag-', '');

    const activeTags = document.querySelectorAll('a.active[href^="#tag-"]');
    for (const activeTag of activeTags) {
        activeTag.classList.remove('active');
    }

    const allHrefs = document.querySelectorAll(`[href="${href}"]`);
    for (const allHref of allHrefs) {
        allHref.classList.add('active');
    }
    generateTitleLinks('[data-tags~="' + tag + '"]');
}

function addClickListenersToTags() {
    const tags = document.querySelectorAll('[href^="#tag-"');
    for (const tag of tags) {
        tag.addEventListener('click', tagClickHandler)
    }
}

addClickListenersToTags();
function lowercaseAndHyphenString(string) {
    // mario-monti
    let lowercase = string.toLowerCase();
    let splitString = lowercase.split(' ');
    let hyphenString = splitString.join('-');
    return hyphenString;
}


function generateAuthors() {
    const authors = document.querySelectorAll('.post-author');
    const postAuthors = document.querySelector('.authors');
    let html = '';
    let arrAuthor = Array.from(authors).map(author => author.innerHTML.replace('by ', ''));
    let finalAuthors = arrAuthor.filter((element, index) => {
        return arrAuthor.indexOf(element) === index;
    });
    for (const finalAuthor of finalAuthors) {
        const linkHTML = `<li><a href="#tag-${lowercaseAndHyphenString(finalAuthor)}">${finalAuthor}</a></li>`;
        html += linkHTML;
    }
    postAuthors.innerHTML = html;
}
generateAuthors();


function authorClickHandler(event) {
    event.preventDefault();

    const clickedElement = this;
    const href = clickedElement.getAttribute('href');
    const author = href.replace('#tag-', '');

    const activeAuthors = document.querySelectorAll('a.active[href^="#tag-"]');
    for (const activeAuthor of activeAuthors) {
        activeAuthor.classList.remove('active');
    }

    const allHrefs = document.querySelectorAll(`[href="${href}"]`);
    for (const allHref of allHrefs) {
        allHref.classList.add('active');
    }
    generateTitleLinks('[data-author="' + author + '"]');
}

function addClickListenersToAuthors() {
    const authors = document.querySelectorAll('[href^="#tag-"');
    for (const author of authors) {
        author.addEventListener('click', authorClickHandler)
    }
}

addClickListenersToAuthors();