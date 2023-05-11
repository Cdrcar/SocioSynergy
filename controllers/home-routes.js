// TODO: Create the following Handlebars templates: single-post, posts-comments
// Import Modules
const sequelize = require ('../config/connection');
const { Post, User, Comment } = require ('../models');
const router = require ('express').Router();

// GET request for homepage to retrive all posts from database
router.get('/', async (req, res) => {
    try {
        const postData = await Post.findAll({
            include: [
                {
                    model: User,
                    attributes: ['username'],
                }
            ],
            order: [
                ['created_at', 'DESC']
            ]
        });
        const posts = postData.map((post) => post.get({ plain:true }));
        console.log(posts)
        res.render('homepage', { posts, logged_in: req.session.logged_in })
    } catch (error) {
        res.status(500).json(error);
    }
})
// router.get('/', (req, res) => {
//     Post.findAll({
//         attributes: [
//             'id',
//             'title',
//             'content',
//             'created_at'
//         ],
//         include: [{
//             model: Comment,
//             attributes: [
//                 'id',
//                 'text',
//                 'post_id',
//                 'user_id', 
//                 'created_at'
//             ],
//             include: {
//                 model: User,
//                 attributes: ['username']
//             }
//         },
//         {
//         model: User,
//         attributes: ['username']
//         }]
//     })
//     .then(data => {
//         const posts = data.map(post => post.get({ plain: true }))
//         console.log(posts)
//         res.render('homepage', { posts, loggedIn: req.session.loggedIn });
//     })
//     .catch(err => {
//         console.log(err);
//         res.status(500).json(err);
//     });
// });


// GET route for login endpoint
router.get('/login', (req, res) => {
    if (req.session.loggedIn) {
        res.redirect('/');
        return;
    }
    res.render('login');
});


// GET route for signup endpoint
router.get('/signup', (req, res) => {
    if (req.session.loggedIn) {
        res.redirect('/');
        return;
    }
    res.render('signup');
});


// GET request for specific post 
router.get('/post/:id', (req, res) => {
    Post.findOne({
        where: {
            id: req.params.id
        },
        attributes: [
            'id',
            'content',
            'title',
            'created_at'
        ],
        include: [{
            model: Comment,
            attributes: [
                'id', 
                'text', 
                'post_id', 
                'user_id', 
                'created_at'
            ],
            include: {
                model: User,
                attributes: ['username']
            }
        },
        {
            model: User,
            attributes: ['username'] 
        }]
    })
    .then(data => {
        if (!data) {
            res.status(404).json({message: 'A user with this ID could not be found'});
            return;
        }
        const post = data.get({ plain: true});
        console.log(post);
        res.render('single-post', { post, loggedIn: req.session.loggedIn});
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});


// GET endpoint to retrieve from database a specific post as well as the post's comments and user information
router.get('/posts-comments', (req, res) => {
    Post.findOne({
        where: {
            id: req.params.id
        },
        attributes: [
            'id',
            'content',
            'title',
            'created_at'
        ],
        include: [{
            model: Comment,
            attributes: [
                'id',
                'text',
                'post_id',
                'user_id',
                'created_at'
            ],
            include: {
                model: User,
                attributes: ['username']
            }
        },
        {
            model: User,
            attributes: ['username']
        }]
    })
    .then(data => {
        if(!data) {
            res.status(404).json({ message: 'A post with this ID could not be found'});
            return;
        }
        const post = data.get({ plain: true});

        res.render('posts-comments', { post, loggedIn: req.session.loggedIn});
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

module.exports = router;