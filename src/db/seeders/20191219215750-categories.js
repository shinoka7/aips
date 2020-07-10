'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Category', [
        {
            name: 'Academic',
            description: '',
            color: '#196161',
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            name: 'Arts',
            description: '',
            color: '#005E75',
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            name: 'Business',
            description: '',
            color: '#005C99',
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            name: 'Cultural',
            description: '',
            color: '#0050C7',
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            name: 'Food/Culinary',
            description: '',
            color: '#003DF5',
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            name: 'Games/Gaming',
            description: '',
            color: '#2E2EFF',
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            name: 'Governance',
            description: '',
            color: '#5F0FFF',
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            name: 'Greek Life',
            description: '',
            color: '#9100C2',
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            name: 'Health/Wellness',
            description: '',
            color: '#630085',
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            name: 'International Affairs',
            description: '',
            color: '#9E009E',
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            name: 'LGBTQ',
            description: '',
            color: '#A8007E',
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            name: 'Leadership',
            description: '',
            color: '#AD0057',
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            name: 'Media/Technology',
            description: '',
            color: '#A80043',
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            name: 'Other',
            description: '',
            color: '#B30000',
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            name: 'Performance: Comedy',
            description: '',
            color: '#943B00',
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            name: 'Performance: Dance',
            description: '',
            color: '#5C5C00',
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            name: 'Performance: Instruments',
            description: '',
            color: '#8A4500',
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            name: 'Performance: Other',
            description: '',
            color: '#6B5600',
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            name: 'Performance: Singing',
            description: '',
            color: '#383800',
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            name: 'Performance: Theater',
            description: '',
            color: '#496100',
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            name: 'Political',
            description: '',
            color: '#306100',
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            name: 'Pre-Professional',
            description: '',
            color: '#1A6600',
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            name: 'Publication',
            description: '',
            color: '#196619',
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            name: 'Religious/Spiritual',
            description: '',
            color: '#006600',
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            name: 'Science',
            description: '',
            color: '#004228',
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            name: 'Service/Volunteering',
            description: '',
            color: '#005745',
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            name: 'Social',
            description: '',
            color: '#005C8A',
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            name: 'Speech/Debate',
            description: '',
            color: '#7A003D',
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            name: 'Sports/Outdoors',
            description: '',
            color: '#6B5000',
            createdAt: new Date(),
            updatedAt: new Date()
        },
    ], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Category', null, {});
  }
};