'use strict'

const templates = {
    articleLink: Handlebars.compile(document.querySelector('#template-article-link').innerHTML),
    tagCloudLink: Handlebars.compile(document.querySelector('#template-tag-cloud-link').innerHTML),
    authorCloudLink: Handlebars.compile(document.querySelector('#template-author-cloud-link').innerHTML),
    articleTagsLink: Handlebars.compile(document.querySelector('#template-article-tags-link').innerHTML)
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
    const params = {
        min: 100,
        max: 0
    }
    for (let tag in tags) {
        if (tags[tag] > params.max) {
            params.max = tags[tag];
        }
        if (tags[tag] < params.min) {
            params.min = tags[tag];
        }
    }
    return params;
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
            const linkHTMLData = {id: tag};
            const linkHTML = templates.articleTagsLink(linkHTMLData);
            // const linkHTML = `<li><a href="#tag-${tag}">${tag}</a></li> `;
            html += linkHTML;
            if (!allTags.hasOwnProperty(tag)) {
                allTags[tag] = 1;
            } else {
                allTags[tag]++;
            }
        }
        postTags.innerHTML = html;
    }
    const tagsParams = calculateTagParamas(allTags);
    console.log('tagsParams:', tagsParams)
    const tagList = document.querySelector('.tags.list');
    const allTagsData = { tags: [] };
    // let allTagsHTML = '';

    for (let tag in allTags) {
        allTagsData.tags.push({
            tag: tag, //`#tag-${tag}`
            count: allTags[tag],
            className: calculateTagClass(allTags[tag], tagsParams)
        });
        // allTagsHTML += `<li><a class="${calculateTagClass(allTags[tag])}" href="#tag-${tag}">${tag}(${allTags[tag]})</a></li> `;
    }
    tagList.innerHTML = templates.tagCloudLink(allTagsData);
    // tagList.innerHTML = allTagsHTML;

}
function calculateTagClass(count) {
    return `${optCloudClassPrefix}${count}`
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
    let allAuthors = {}; //new
    const authors = document.querySelectorAll('.post-author');
    const postAuthors = document.querySelector('.authors');
    const allAuthorsData = { authors: [] }; //new
    let arrAuthor = Array.from(authors).map(author => author.innerHTML.replace('by ', ''));
    // let finalAuthors = arrAuthor.filter((element, index) => {
    //     return arrAuthor.indexOf(element) === index;
    // });
    for (const finalAuthor of arrAuthor) {
        if (!allAuthors.hasOwnProperty(finalAuthor)) {
            allAuthors[finalAuthor] = 1;
        } else {
            allAuthors[finalAuthor]++;
        }
    }
    for (let finalAuthor in allAuthors) {
        allAuthorsData.authors.push({
            finalAuthor: finalAuthor, 
            count: allAuthors[finalAuthor],
            className: allAuthors[finalAuthor],
            hrefAuthor: lowercaseAndHyphenString(finalAuthor)
        });
        // let linkHTML = `<li><a class="${optCloudClassPrefix}${allAuthors[finalAuthor]}" href="#tag-author-${lowercaseAndHyphenString(finalAuthor)}">${finalAuthor}(${allAuthors[finalAuthor]})</a></li>`;
        // html += linkHTML;
    }
    postAuthors.innerHTML = templates.authorCloudLink(allAuthorsData);
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