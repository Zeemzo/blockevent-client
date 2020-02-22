
export interface QuestionFormat {

    question: string,
    type: string,
    formcontrol: {
        name: string
    }
    optionvalues?: [
        {
            placeholder: string,
            value: string
        }
    ]

}


const questions = [

    {

    }


]


export const ValidationQuestions = [
    {
        question: 'Google was founded by Larry Page and who else?',
        answers: [
            'Terry Winograd', 'Steve Jobs', 'Sergey Brin', 'Bill Gates'
        ],

    },
    {
        question: 'The name Google originated from a misspelling of:',
        answers: [
            'Googad', 'Googol', 'Goosearch', 'Goolink'
        ]
    },

    {
        question: 'The domain name www.google.com was registered on:',
        answers: ['January 12, 1998', 'September 15, 1997', 'August 7, 1999', 'September 7, 1996']
    },

    {
        question: 'In 1998, when Google.com was still in beta, they were answering up to how many search queries a day?',
        answers: ['30,000', '450,000', '80,000', '10,000']
    },
    {
        question: 'The basis of Google\'s search technology is called PageRank. Who is it named after?',
        // tslint:disable-next-line:max-line-length
        answers: ['The original Google home page', 'The number of pages Google is capable of searching', 'Google co-founder Larry Page', 'Sergey Brin\'s girlfriend, Paige']
    },
    {
        question: 'Google\'s informal corporate motto or slogan is?',
        // tslint:disable-next-line:max-line-length
        answers: ['Always First', 'Turning the page', 'Experience the Difference', 'Don\'t Be Evil']
    }
    ,
    {
        question: 'What year did Sergey Brin meet Larry Page?',
        // tslint:disable-next-line:max-line-length
        answers: ['1992', '1994', '1995', '1998']
    },
    {
        question: 'Where are the Google headquarters located?',
        // tslint:disable-next-line:max-line-length
        answers: ['Arlington, Virginia', 'Uranus', 'Mountain View, California', 'Washington DC']
    },

    {
        question: 'What is the Google headquarters called?',
        // tslint:disable-next-line:max-line-length
        answers: ['The Pit', 'Googledome', 'Calgary Saddledome', 'Googleplex']
    },

    {
        // tslint:disable-next-line:max-line-length
        question: 'In January of 1996, shortly before the launch of Google, a new search engine was brought into existence. What was this search engine called?',
        // tslint:disable-next-line:max-line-length
        answers: ['BackLinks', 'BackUp', 'BreakUp', 'BackRub']
    },

    {
        question: 'What is the Google headquarters called?',
        // tslint:disable-next-line:max-line-length
        answers: ['The Pit', 'Googledome', 'Calgary Saddledome', 'Googleplex']
    },
    {
        question: 'In what location did Google originally operate from?',
        // tslint:disable-next-line:max-line-length
        answers: ['Garage', 'Office', 'Bedroom', 'Attic']
    },
    {
        question: 'Which company did Google buy in July of 2006?',
        // tslint:disable-next-line:max-line-length 
        answers: ['WhoTube', 'YouTube', 'YouVideo', 'Windows Media Player']
    },
    {
        question: 'Which search operator does Google enable by default?',
        // tslint:disable-next-line:max-line-length
        answers: ['The AND operator', 'The OR operator', 'The NOT operator', 'Google Operator']
    },
    {
        question: 'Google AdSense is an _________ ?',
        // tslint:disable-next-line:max-line-length
        answers: ['Online Advertisement Serving Program', 'Online Pizza Shop', 'Online Address Directory Service', 'Online Application for Web developers']
    },
    {
        question: 'What is Stadia? ',
        // tslint:disable-next-line:max-line-length
        answers: ['Latest AI framework introduced by Google', 'Google\'s cloud game streaming service', 'Google\'s newest media player',
            'Google\'s first ever video streaming service']
    },
    {
        question: 'Using Firebase, you cannot..',
        // tslint:disable-next-line:max-line-length
        answers: ['use machine learning skills to applications', 'Track performance of your application ', 'Create template based android applications ',
            'Obtain user insights for your application']
    },




]