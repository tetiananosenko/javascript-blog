'use strict'

const templates = {
    articleLink: Handlebars.compile(document.querySelector('#template-article-link').innerHTML),
    tagCloudLink: Handlebars.compile(document.querySelector('#template-tag-cloud-link').innerHTML),
    authorLink: Handlebars.compile(document.querySelector('#template-author-link').innerHTML)
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
    console.log(values);
    const mathcalc = {
        min: Math.min(...values),
        max: Math.max(...values)
    }
    return mathcalc;
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
            const linkHTMLData = {
                id: tag,
                title: tag
            };
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
    const params = calculateTagParamas(allTags);
    console.log('params', params);
    for (let tag in allTags) {
        allTagsData.tags.push({
            tag: tag,
            href: tag,
            count: allTags[tag],
            className: calculateClass(params, allTags[tag])
        });

    }
    tagList.innerHTML = templates.tagCloudLink(allTagsData);

}
function calculateClass(params, count) {
    const normalizedCount = count - params.min;
    const normalizedMax = params.max - params.min;
    const percentage = normalizedCount / normalizedMax;
    const classNumber = Math.floor(percentage * (optCloudClassCount - 1) + 1);
    return optCloudClassPrefix + classNumber;
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
        // let html = '';
        const dataAuthors = article.getAttribute('data-author');
        const linkData = {
         id: `tag-author-${dataAuthors}`,
         title: dataAuthors
        }
        // html += linkHTML;
        if (!allAuthors.hasOwnProperty(dataAuthors)) {
            allAuthors[dataAuthors] = 1;
        } else {
            allAuthors[dataAuthors]++;
        }
        postAuthors.innerHTML = templates.authorLink(linkData);
    }
    const authorList = document.querySelector('.authors.list');
    const allAuthorsData = { tags: [] };
    const params = calculateTagParamas(allAuthors);
    for (let dataAuthors in allAuthors) {
        allAuthorsData.tags.push({
            tag: dataAuthors,
            count: allAuthors[dataAuthors],
            href: `author-${dataAuthors}`,
            className: calculateClass(params, allAuthors[dataAuthors])
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
