//contain languages 
let containerLanguages = $('.list-language');
//contain language and repo
let containLanguagesAndRepos = $('.language-and-number-of-repo');

//when page loaded get repos
$('.button').click(function () {
    getRepos();
})
//send a request to get most trending repo in last 30 day
function getRepos() {
    containerLanguages.html('');
    reposAndNumber = [];
    let today = new Date().toISOString().split('T')[0]

    let last30days = new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0]

    $.ajax({
        url: `https://api.github.com/search/repositories?q=created:${last30days}..${today}&sort=stars&order=desc`,
        type: 'GET',
        success: function (res) {
            //send repositories that founded to getLanguage function
            getLanguage(res)
        }
    });

}

//get repsotories and return  the languages that made this  respostories 
function getLanguage(res) {
    //make for loop on respostories item to get language that made this repo
    for (let i = 0; i < res['items'].length; i++) {
        //send ajax request to url of language to display language 

        $.ajax({
            url: res['items'][i].languages_url,
            type: 'GET',
            success: function (respostory) {
                //convert object to array 
                response = Object.entries(respostory);
                if (response.length !== 0) {

                    containerLanguages.append(`<div class="col-md-3 col-sm-2 mb-2 mr-3 btn btn-info   overflow-hidden">  ${response[0][0]}  </div>`)

                    element = { 'Langauge': response[0][0], count: 1, 'Repo': [res['items'][i]['full_name']] };
                    //this means this is the last language in repos


                    collectLanaguages(element);
                    // means is the no more repos for this send to display languages and repos
                    if (res['items'].length - 1 == i) {
                        DisplayLanguageAndRepos();
                    }

                }

            }
        })
    }


}
//this store Language , Repo and Number of Repo
var reposAndNumber = [];

//collect language in variable respoAndNumber
function collectLanaguages(element) {

    let position = 0, repository = [];

    for (let i = 0; i < reposAndNumber.length; i++) {

        if (reposAndNumber[i].Langauge === element.Langauge) {
            reposAndNumber[i].count += 1;
            reposAndNumber[i].Repo.push(element.Repo[0])
            position = 1;
            repository.push(element.Repo[0]);

            break;
        }

    }

    if (position == 0) {
        reposAndNumber.push(element)

    }


}
//display language and number of repos for this language in html 
function DisplayLanguageAndRepos() {
    for (let i = 0; i < reposAndNumber.length; i++) {

        containLanguagesAndRepos.append(`<div class="alert alert-primary rep${i}" role="alert">
                                             <h5>Language : <span class='text-primary'> ${reposAndNumber[i].Langauge} </span> </h5>
                                             <span>Number of Repo :  ${reposAndNumber[i].count}    </span>
                                             <div class='text-primary repo'>
                                                <p class='text-dark'>Respos :</p>
                                             </div>
                                        </div>`);
        extractRepos(reposAndNumber[i].Repo, i);

    }
}
//this for display repos that belong Lanaguge 
function extractRepos(repos, index) {

    for (let i = 0; i < repos.length; i++) {
        $(`.rep${index} .repo`).append(` <h5 class='border border-dark p-3 '>${i + 1}: ${repos[i]} </h5> `);
    }

}
