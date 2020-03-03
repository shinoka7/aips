'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Category', [
        {
            name: 'Academic',
            description: '',
            color: '#33cccc',
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            name: 'Arts',
            description: '',
            color: '#00ccff',
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            name: 'Business',
            description: '',
            color: '#0099ff',
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            name: 'Cultural',
            description: '',
            color: '#0066ff',
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            name: 'Food/Culinary',
            description: '',
            color: '#3366ff',
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            name: 'Games/Gaming',
            description: '',
            color: '#6666ff',
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            name: 'Governance',
            description: '',
            color: '#9966ff',
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            name: 'Greek Life',
            description: '',
            color: '#cc33ff',
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            name: 'Health/Wellness',
            description: '',
            color: '#cc33ff',
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            name: 'International Affairs',
            description: '',
            color: '#ff00ff',
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            name: 'LGBTQ',
            description: '',
            color: '#ff33cc',
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            name: 'Leadership',
            description: '',
            color: '#ff3399',
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            name: 'Media/Technology',
            description: '',
            color: '#ff0066',
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            name: 'Other',
            description: '',
            color: '#ff5050',
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            name: 'Performance: Comedy',
            description: '',
            color: '#ff6600',
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
            color: '#ff9933',
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            name: 'Performance: Other',
            description: '',
            color: '#ffcc00',
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            name: 'Performance: Singing',
            description: '',
            color: '#ffff00',
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            name: 'Performance: Theater',
            description: '',
            color: '#ccff33',
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            name: 'Political',
            description: '',
            color: '#99ff33',
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            name: 'Pre-Professional',
            description: '',
            color: '#66ff33',
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            name: 'Publication',
            description: '',
            color: '#33cc33',
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            name: 'Religious/Spiritual',
            description: '',
            color: '#00ff00',
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            name: 'Science',
            description: '',
            color: '#00ff99',
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            name: 'Service/Volunteering',
            description: '',
            color: '#00ffcc',
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            name: 'Social',
            description: '',
            color: '#66ccff',
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            name: 'Speech/Debate',
            description: '',
            color: '#ff99cc',
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            name: 'Sports/Outdoors',
            description: '',
            color: '#cc9900',
            createdAt: new Date(),
            updatedAt: new Date()
        },
    ], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Category', null, {});
  }
};