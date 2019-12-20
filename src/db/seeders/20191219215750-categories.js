'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Category', [
        {
            name: 'Academic',
            description: '',
            color: '',
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            name: 'Arts',
            description: '',
            color: '',
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            name: 'Cultural',
            description: '',
            color: '',
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            name: 'Business',
            description: '',
            color: '',
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            name: 'Food/Culinary',
            description: '',
            color: '',
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            name: 'Games/Gaming',
            description: '',
            color: '',
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            name: 'Governance',
            description: '',
            color: '',
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            name: 'Greek Life',
            description: '',
            color: '',
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            name: 'Health/Wellness',
            description: '',
            color: '',
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            name: 'International Affairs',
            description: '',
            color: '',
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            name: 'LGBTQ',
            description: '',
            color: '',
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            name: 'Leadership',
            description: '',
            color: '',
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            name: 'Media/Technology',
            description: '',
            color: '',
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            name: 'Other',
            description: '',
            color: '',
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            name: 'Performance: Comedy',
            description: '',
            color: '',
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            name: 'Performance: Dance',
            description: '',
            color: '',
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            name: 'Performance: Instruments',
            description: '',
            color: '',
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            name: 'Performance: Other',
            description: '',
            color: '',
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            name: 'Performance: Singing',
            description: '',
            color: '',
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            name: 'Performance: Theater',
            description: '',
            color: '',
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            name: 'Political',
            description: '',
            color: '',
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            name: 'Pre-Professional',
            description: '',
            color: '',
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            name: 'Publication',
            description: '',
            color: '',
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            name: 'Religious/Spiritual',
            description: '',
            color: '',
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            name: 'Science',
            description: '',
            color: '',
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            name: 'Service/Volunteering',
            description: '',
            color: '',
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            name: 'Social',
            description: '',
            color: '',
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            name: 'Speech/Debate',
            description: '',
            color: '',
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            name: 'Sports/Outdoors',
            description: '',
            color: '',
            createdAt: new Date(),
            updatedAt: new Date()
        },
    ], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Category', null, {});
  }
};