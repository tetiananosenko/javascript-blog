'use strict'

const templates = {
    articleLink: Handlebars.compile(document.querySelector('#template-article-link').innerHTML),
    tagCloudLink: Handlebars.compile(document.querySelector('#template-tag-cloud-link').innerHTML),
}

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
    optTitleListSelector = '.titles',
    optCloudClassCount = 5,
    optCloudClassPrefix = 'tag-size-';

function generateTitleLinks(customSelector = '') {
    const titleList = document.querySelector(optTitleListSelector);
    let html = '';

    const articles = document.querySelectorAll(optArticleSelector + customSelector);
    for (let article of articles) {
        const articleId = article.getAttribute('id');
        const articleTitle = article.querySelector(optTitleSelector).innerHTML;
        const linkHTMLData = { id: articleId, title: articleTitle };
        const linkHTML = templates.articleLink(linkHTMLData);
        html += linkHTML;
    }

    titleList.innerHTML = html;
    console.log(html);
    const links = document.querySelectorAll('.titles a');
    for (let link of links) {
        link.addEventListener('click', titleClickHandler);
    }
}
generateTitleLinks();

function calculateTagParamas(tags) {
    const values = Object.values(tags);
    const max = Math.max(values);

    return max;
}
function generateTags() {
    let allTags = {};
    const articles = document.querySelectorAll('.post');
    for (let article of articles) {
        const postTags = article.querySelector('.post-tags .list');

        let html = '';
        const dataTags = article.getAttribute('data-tags');
        const dataTagsArr = dataTags.split(' ');

        for (let tag of dataTagsArr) {
            const linkHTMLData = { id: tag };
            const linkHTML = templates.articleLink(linkHTMLData);
            html += linkHTML;
            if (!allTags.hasOwnProperty(tag)) {
                allTags[tag] = 1;
            } else {
                allTags[tag]++;
            }
        }
        postTags.innerHTML = html;
    }
    const tagList = document.querySelector('.tags.list');
    const allTagsData = { tags: [] };

    for (let tag in allTags) {
        allTagsData.tags.push({
            tag: tag,
            href: tag, 
            count: allTags[tag],
            className: calculateClass(allTags[tag])
        });

    }
    tagList.innerHTML = templates.tagCloudLink(allTagsData);

}
function calculateClass(currentValue) {
    if (currentValue < optCloudClassCount) {
        return `${optCloudClassPrefix}${currentValue}`
    } 
    return `${optCloudClassPrefix}${optCloudClassCount}`
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

function generateAuthors() {
    let allAuthors = {};
    const articles = document.querySelectorAll('.post');
    for (let article of articles) {
        const postAuthors = article.querySelector('.post-author');
        let html = '';
        const dataAuthors = article.getAttribute('data-author');
        const linkHTML = `<a href="#tag-author-${dataAuthors}">${dataAuthors}</a>`;
        html += linkHTML;
        if (!allAuthors.hasOwnProperty(dataAuthors)) {
            allAuthors[dataAuthors] = 1;
        } else {
            allAuthors[dataAuthors]++;
        }
        postAuthors.innerHTML = html;
    }
    const authorList = document.querySelector('.authors.list');
    const allAuthorsData = { tags: [] };
    for (let dataAuthors in allAuthors) {
        allAuthorsData.tags.push({
            tag: dataAuthors,
            count: allAuthors[dataAuthors],
            href: `author-${dataAuthors}`,
            className: `tag-size-${allAuthors[dataAuthors]}`
        });
    }
    authorList.innerHTML = templates.tagCloudLink(allAuthorsData);
}


generateAuthors();

function authorClickHandler(event) {
    event.preventDefault();
    const clickedElement = this;
    const href = clickedElement.getAttribute('href');
    const author = href.replace('#tag-author-', '');
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
    const authors = document.querySelectorAll('[href^="#tag-author"');
    for (const author of authors) {
        author.addEventListener('click', authorClickHandler)
    }
}
addClickListenersToAuthors();
