const { handleContactForm } = require('./contact'); 

const getHome = (req, res) => {
    res.render('home', { title: 'Evimere Energy | Home' });
};

const getAbout = (req, res) => {
    res.render('home', { title: 'About Us' }); 
};


const getServices = (req, res) => {
    res.render('home', { title: 'Our Services' });
};

const getContact = (req, res) => {
    res.render('home', { title: 'Contact Us' });
}

const postContact = handleContactForm; 

module.exports = {
    getHome,
    getAbout,
    getServices,
    getContact,
    postContact
};